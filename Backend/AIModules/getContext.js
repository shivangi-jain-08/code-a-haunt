const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { ChatOpenAI } = require("@langchain/openai");
const { z } = require("zod");
const dotenv = require("dotenv");
const { StringOutputParser } = require("@langchain/core/output_parsers");
dotenv.config();

const getTherapyContext = async (globalContext,unstructuredInput, approach) => {
  try {
    console.log("Calling AI to get Context");

    const UserProblem = await getUserProblemContext(globalContext, unstructuredInput);
    const UserSolution = await getUserSolutionContext(globalContext,UserProblem, approach);

    const res = {
      UserProblem,
      UserSolution,
    };
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);
  }
};

const getUserProblemContext = async (globalContext,unstructuredInput) => {
  try {
    const openaiModel = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.7,
    });
    const context_prompt = ChatPromptTemplate.fromTemplate(
      `Analyze the User Personality and history Details and Give the summary of the Problem in 200 words in first person perspective
    
    Problem:
    {unstructuredInput}

    User Personality Detail and History:
    {UserDetail}
    `
    );

    const context_chain = context_prompt
      .pipe(openaiModel)
      .pipe(new StringOutputParser());

    const res = await context_chain.invoke({
      unstructuredInput,
      UserDetail: JSON.stringify(globalContext)
    });
    console.log(res);

    return res;
  } catch (error) {
    console.error(error);
  }
};

const getUserSolutionContext = async (globalContext,problem, approach) => {
  try {
    const openaiModel = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.7,
    });
    const context_prompt = ChatPromptTemplate.fromTemplate(
      `I want a response based on a therapist's perspective. Here is the problem: {problem}.Here is the Persons Personality History: {UserDetail} Please approach the solution using {approach}. The response should be empathetic, practical, and actionable
    `
    );

    const context_chain = context_prompt
      .pipe(openaiModel)
      .pipe(new StringOutputParser());

    const res = await context_chain.invoke({
      problem,
      approach,
      UserDetail: JSON.stringify(globalContext)
    });
    console.log(res);

    return res;
  } catch (error) {
    console.error(error);
  }
};


const updateTherapyContext = async (UserPrevProblem,UserPrevSolution,chatHistory) => {
  try {
    console.log("Calling AI to get Context");

    const UserProblem = await updateUserProblemContext(UserPrevProblem,chatHistory);
    const UserSolution = await updateUserSolutionContext(UserPrevSolution, chatHistory);

    const res = {
      UserProblem,
      UserSolution,
    };
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);
  }

}

const updateUserProblemContext = async(UserProblem,chatHistory) => {
  try {
    const openaiModel = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.7,
    });
    const context_prompt = ChatPromptTemplate.fromTemplate(
      `Update the summary by comparing between Problem Before and The chat they had with therapist of the Problem in 200 words in first person perspective. Only give the updated problem, no feedback or changes after session
    
    Problem Before:
    {UserProblem}


    ChatHistory:
    {chatHistory}
    `
    );

    const context_chain = context_prompt
      .pipe(openaiModel)
      .pipe(new StringOutputParser());

    const res = await context_chain.invoke({
      UserProblem,chatHistory: JSON.stringify(chatHistory)
    });
    console.log(res);

    return res;
  } catch (error) {
    console.error(error);
  }
}

const updateUserSolutionContext = async(UserSolution,chatHistory)=>{
  try {
    const openaiModel = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.7,
    });
    const context_prompt = ChatPromptTemplate.fromTemplate(
      `Update the Solution by comparing it with the chatHistory, Just Overwrite, Dont Modify, give in minimum 200 words

      Solution:
      {UserSolution}

      ChatHistory:
      {chatHistory}
    `
    );

    const context_chain = context_prompt
      .pipe(openaiModel)
      .pipe(new StringOutputParser());

    const res = await context_chain.invoke({
      UserSolution,
      chatHistory: JSON.stringify(chatHistory),
    });
    console.log(res);

    return res;
  } catch (error) {
    console.error(error);
  }
}
// getTherapyContext("I am suffering from Autism, and it is not the sad part, the sad part is I get bullied because of ti, people make fun of me, dont take me seriously, and I ahave became a clown. I want to fix my autism or atleast get courage to face the bullies.","Solution-Focused Brief Therapy")
module.exports = {
  getTherapyContext,
  updateTherapyContext
};
