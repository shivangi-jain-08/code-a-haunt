const mongoose = require('mongoose');

const UserDetailSchema = new mongoose.Schema({

  majorIssues: { type: [String], default: [] }, // e.g., ['Anxiety', 'Depression']
  
  recentSymptoms: { type: [String], default: [] }, // e.g., ['Insomnia', 'Lack of Motivation']

  relationships: {
    family: { type: String, default: 'No Record' },
    friends: { type: String, default: 'No record' },
    romantic: { type: String, default: 'No record' }
  },

  career: {
    profession: { type: String, default: 'Unemployed' },
    stressLevel: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Moderate' },
    jobSatisfaction: { type: String, enum: ['Satisfied', 'Neutral', 'Dissatisfied'], default: 'Neutral' }
  },

  triggers: { type: [String], default: [] }, // e.g., ['Social situations', 'Work pressure']

  copingMechanisms: { type: [String], default: [] }, // e.g., ['Meditation', 'Exercise', 'Avoidance']

  supportSystem: {
    family: { type: Boolean, default: false },
    friends: { type: Boolean, default: false },
    therapist: { type: Boolean, default: false }
  },

  medicalHistory: {
    pastDiagnoses: { type: [String], default: [] },
    medications: { type: [String], default: [] },
  },

  familyHistory: { type: [String], default: [] }, // e.g., ['Depression in mother']

  lifestyle: {
    sleepHours: { type: Number, default: 7, min: 0, max: 24 },
    dietQuality: { type: String, enum: ['Poor', 'Average', 'Healthy'], default: 'Average' },
    exerciseFrequency: { type: String, enum: ['Never', 'Rarely', 'Occasionally', 'Regularly'], default: 'Occasionally' },
    substanceUse: { type: String, enum: ['None', 'Occasional', 'Frequent'], default: 'None' }
  },

  therapeuticGoals: { type: [String], default: [] }, // e.g., ['Improve self-esteem', 'Reduce anxiety']
  
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Non-binary', 'Other'], required: true },
  sex: { type: String, enum: ['Male', 'Female', 'Intersex', 'Other'], required: true }
});


module.exports = UserDetailSchema;
