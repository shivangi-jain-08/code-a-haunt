import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { z } from "zod";
import { tool } from "@langchain/core/tools";

export const doChat = async (input,context,chatHistory) => {
  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.9,
  });

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });

  const vectorStore = new MemoryVectorStore(embeddings);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const allSplits = await splitter.splitDocuments(context);
  await vectorStore.addDocuments(allSplits);

  const retrieveSchema = z.object({ query: z.string() });

  const retrieve = tool(
    async ({ query }) => {
      const retrievedDocs = await vectorStore.similaritySearch(query, 2);
      const serialized = retrievedDocs
        .map(
          (doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
        )
        .join("\n");
      return [serialized, retrievedDocs];
    },
    {
      name: "retrieve",
      description: "Retrieve information related to a query.",
      schema: retrieveSchema,
      responseFormat: "content_and_artifact",
    }
  );

  //chat functions

  // Step 1: Generate an AIMessage that may include a tool-call to be sent.
  async function queryOrRespond(state) {
    const llmWithTools = llm.bindTools([retrieve]);
    const response = await llmWithTools.invoke(state.messages);
    // MessagesState appends messages to state instead of overwriting
    return { messages: [response] };
  }

  const tools = new ToolNode([retrieve]);
  // Step 3: Generate a response using the retrieved content.
  async function generate(state) {
    // Get generated ToolMessages
    let recentToolMessages = [];
    for (let i = state["messages"].length - 1; i >= 0; i--) {
      let message = state["messages"][i];
      if (message instanceof ToolMessage) {
        recentToolMessages.push(message);
      } else {
        break;
      }
    }
    let toolMessages = recentToolMessages.reverse();

    // Format into prompt
    const docsContent = toolMessages.map((doc) => doc.content).join("\n");
    const systemMessageContent =
      "You are an assistant for question-answering tasks. " +
      "Use the following pieces of retrieved context to answer " +
      "the question. If you don't know the answer, say that sorry, but you " +
      "cannot help with this query. Use three sentences maximum and keep the " +
      "answer concise." +
      "\n\n" +
      `${docsContent}`;

    const conversationMessages = state.messages.filter(
      (message) =>
        message instanceof HumanMessage ||
        message instanceof SystemMessage ||
        (message instanceof AIMessage && message.tool_calls.length == 0)
    );
    const prompt = [
      new SystemMessage(systemMessageContent),
      ...conversationMessages,
    ];

    // Run
    const response = await llm.invoke(prompt);
    return { messages: [...chatHistory,response] };
  }

  const graphBuilder = new StateGraph(MessagesAnnotation)
    .addNode("queryOrRespond", queryOrRespond)
    .addNode("tools", tools)
    .addNode("generate", generate)
    .addEdge("__start__", "queryOrRespond")
    .addConditionalEdges("queryOrRespond", toolsCondition, {
      __end__: "__end__",
      tools: "tools",
    })
    .addEdge("tools", "generate")
    .addEdge("generate", "__end__");

  let checkpointer = new MemorySaver();

  const graphWithMemory = graphBuilder.compile({ checkpointer });
  let chatContent;
  for await (const step of await graphWithMemory.stream(input, {
    configurable: { thread_id: "abc123" },
    streamMode: "values",
  })) {
    const lastMessage = step.messages[step.messages.length - 1];
    if (!lastMessage.name || lastMessage.name != "retrieve") {
      if (lastMessage.content.length > 0) {
        chatContent = lastMessage.content;
        return {
            text: chatContent,
            chatHistory: [...chatHistory,
                {role: "user",content: input},
                {role: "assistant",content: chatContent}
            ]
        }
      }
    }
  }
};