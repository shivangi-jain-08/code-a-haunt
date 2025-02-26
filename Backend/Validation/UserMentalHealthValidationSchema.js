const Joi = require("joi");

// Joi Schema for validating user mental health data
const UserMentalHealthValidationSchema = Joi.object({
  majorIssues: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).default([]),
  recentSymptoms: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).default([]),

  relationships: Joi.object({
    family: Joi.string().default("No record"),
    friends: Joi.string().default("No record"),
    romantic: Joi.string().default("No record"),
  }),

  career: Joi.object({
    profession: Joi.string().default("Unemployed"),
    stressLevel: Joi.string().valid("Low", "Moderate", "High").default("Moderate"),
    jobSatisfaction: Joi.string().valid("Satisfied", "Neutral", "Dissatisfied").default("Neutral"),
  }),

  triggers: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).default([]),
  copingMechanisms: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).default([]),

  supportSystem: Joi.object({
    family: Joi.boolean().default(false),
    friends: Joi.boolean().default(false),
    therapist: Joi.boolean().default(false),
  }),

  medicalHistory: Joi.object({
    pastDiagnoses: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).default([]),
    medications: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).default([]),
  }),

  familyHistory: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).default([]),

  lifestyle: Joi.object({
    sleepHours: Joi.number().min(0).max(24).default(7),
    dietQuality: Joi.string().valid("Poor", "Average", "Healthy").default("Average"),
    exerciseFrequency: Joi.string().valid("Never", "Rarely", "Occasionally", "Regularly").default("Occasionally"),
    substanceUse: Joi.string().valid("None", "Occasional", "Frequent").default("None"),
  }),

  therapeuticGoals: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).default([]),

  age: Joi.number().integer().min(10).max(120).required(),
  gender: Joi.string().valid("Male", "Female", "Non-binary", "Other").required(),
  sex: Joi.string().valid("Male", "Female", "Intersex", "Other").required(),
});

module.exports = UserMentalHealthValidationSchema;
