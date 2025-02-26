const dotenv = require("dotenv");
dotenv.config();
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const {
  CommaSeparatedListOutputParser,
} = require("@langchain/core/output_parsers");

const getRefinedUserDetail = async (rawInput) => {
  try {
    const keysToRefine = [
      "majorIssues",
      "recentSymptoms",
      "triggers",
      "copingMechanisms",
      "medicalHistory.pastDiagnoses",
      "medicalHistory.medications",
      "familyHistory",
      "therapeuticGoals",
    ];
    const relationshipKeysToRefine = [
        "relationships.family",
        "relationships.friends",
        "relationships.romantic"
      ];

    let refinedData = { ...rawInput };

    for (const key of keysToRefine) {
      const value = key.split(".").reduce((obj, prop) => obj?.[prop], rawInput);

      if (typeof value === "string" && value.trim() !== "") {
        const refinedArray = await getRefinedDataArray(value, key); // Pass key name
        if (refinedArray && Array.isArray(refinedArray)) {
          setNestedValue(refinedData, key, refinedArray);
        }
      }
    }

    for (const key of relationshipKeysToRefine) {
        const value = key.split('.').reduce((obj, prop) => obj?.[prop], rawInput);
  
        if (typeof value === "string" && value.trim() !== "") {
          const refinedString = await getRefinedData(value, key); // Use getRefinedData for relationships
          if (typeof refinedString === "string") {
            setNestedValue(refinedData, key, refinedString);
          }
        }
      }

    return refinedData;
  } catch (error) {
    console.error("Error refining user details:", error);
    return error;
  }
};

// Utility function to set nested object values
const setNestedValue = (obj, path, value) => {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {}; // Ensure path exists
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
};

const getRefinedDataArray = async (rawData, property) => {
  try {
    const model = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.7,
    });
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Your task is to understand the sentence given by the user, find the {property} of the person from that sentence, convert it to third person perspective, break it, and give the output as comma separated values only",
      ],
      ["human", "{input}"],
    ]);
    const arrayOutputParser = new CommaSeparatedListOutputParser();
    const chain = prompt.pipe(model).pipe(arrayOutputParser);

    const res = await chain.invoke({
      input: rawData,
      property,
    });
    return res;
  } catch (error) {
    return error;
  }
};

const getRefinedData = async (rawData, property) => {
  try {
    const model = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.7,
    });
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Your task is to understand the sentence given by the user, find the {property} of the person from that sentence, convert it to third person perspective, break it, and give",
      ],
      ["human", "{input}"],
    ]);
    const arrayOutputParser = new CommaSeparatedListOutputParser();
    const chain = prompt.pipe(model).pipe(arrayOutputParser);

    const res = await chain.invoke({
      input: rawData,
      property,
    });
    return res;
  } catch (error) {
    return error;
  }
};

module.exports = { getRefinedUserDetail };
