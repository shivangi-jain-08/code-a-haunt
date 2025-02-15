const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { ChatOpenAI } = require("@langchain/openai");
const { z } = require("zod");
const dotenv = require("dotenv");
const { StringOutputParser } = require("@langchain/core/output_parsers");
dotenv.config();

const getTherapyContext = async (unstructuredInput, approach) => {
  try {
    console.log("Calling AI to get Context");

    const UserProblem = await getUserProblemContext(unstructuredInput);
    const UserSolution = await getUserSolutionContext(UserProblem, approach);

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

const getUserProblemContext = async (unstructuredInput) => {
  try {
    const openaiModel = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.7,
    });
    const context_prompt = ChatPromptTemplate.fromTemplate(
      `Give the summary of the Problem in 200 words in first person perspective
    
    Problem:
    {unstructuredInput}
    `
    );

    const context_chain = context_prompt
      .pipe(openaiModel)
      .pipe(new StringOutputParser());

    const res = await context_chain.invoke({
      unstructuredInput,
    });
    console.log(res);

    return res;
  } catch (error) {
    console.error(error);
  }
};

const getUserSolutionContext = async (problem, approach) => {
  try {
    const openaiModel = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.7,
    });
    const context_prompt = ChatPromptTemplate.fromTemplate(
      `I want a response based on a therapist's perspective. Here is the problem: {problem}. Please approach the solution using {approach}. The response should be empathetic, practical, and actionable
    `
    );

    const context_chain = context_prompt
      .pipe(openaiModel)
      .pipe(new StringOutputParser());

    const res = await context_chain.invoke({
      problem,
      approach,
    });
    console.log(res);

    return res;
  } catch (error) {
    console.error(error);
  }
};

// getTherapyContext("I am suffering from Autism, and it is not the sad part, the sad part is I get bullied because of ti, people make fun of me, dont take me seriously, and I ahave became a clown. I want to fix my autism or atleast get courage to face the bullies.","Solution-Focused Brief Therapy")
module.exports = {
  getTherapyContext,
};
