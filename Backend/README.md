# MindMate AI - Backend

## Getting Started

To start the application, use the following command:

```sh
npm run devStart

```

## Application Endpoint

To visit the endpoint, go to the this URL:

```
http://localhost:3000/
```


## All Therapy Related Endpoints


### Get all Therapy Sessions **(GET)**
```
http://localhost:3000/api/therapydatas/
```

### Get Therapy Session based on ID **(GET)**

```
http://localhost:3000/api/therapydatas/:id
```

### Create Therapy Session **(POST)**


```
http://localhost:3000/api/therapydatas
```

Sample Request Body
```json
{
  "inputProblem": "I have been feeling overwhelmed with anxiety and stress due to increasing workload and expectations at my job. I constantly feel pressured to meet deadlines, and even when I am not working, my mind keeps racing with worries about pending tasks. This has been affecting my sleep, as I often stay awake overthinking or wake up feeling restless. Additionally, I have been struggling with social interactions, as I feel disconnected from friends and find it difficult to engage in conversations. I also experience occasional panic attacks, where my heart races, and I feel short of breath. These feelings have been persistent for several months, and I am finding it hard to cope.",
  "approach": "Mindfulness Based Therapy",
  "therapist": "Clara",
  "username": "john_doe_92"
}
```

### Update Therapy Session based on ID and Chat History **(PATCH)**

```
http://localhost:3000/api/therapydatas/update-context/:id
```

Sample Request Body
```json
{
  "ChatHistory": [
    {
      "role": "user",
      "content": "I feel extremely overwhelmed at work. No matter how much I complete, there's always more to do, and it feels like I'm stuck in an endless cycle of stress."
    },
    {
      "role": "assistant",
      "content": "It sounds like you're dealing with significant work-related stress. Have you noticed any particular triggers that make it worse?"
    },
    {
      "role": "user",
      "content": "Yes, deadlines and expectations from my manager stress me out the most. I constantly worry about whether my work is good enough."
    },
    {
      "role": "assistant",
      "content": "That makes sense. Perfectionism and high expectations can be mentally exhausting. Have you considered setting small, manageable goals to reduce the pressure?"
    },
    {
      "role": "user",
      "content": "Not really. I usually just push through until I burn out. But I guess breaking tasks down could help."
    },
    {
      "role": "assistant",
      "content": "Absolutely! Small steps can make overwhelming tasks feel more manageable. Also, practicing mindfulness or relaxation techniques might help you stay present and reduce stress."
    },
    {
      "role": "user",
      "content": "I’ve heard about mindfulness but never tried it. What exactly should I do?"
    },
    {
      "role": "assistant",
      "content": "Mindfulness involves focusing on the present moment without judgment. Simple exercises like deep breathing, guided meditation, or even taking mindful breaks during work can help lower stress levels."
    }
  ]
}

```


## All User Related Endpoints

### Update Refined User's Personality Details based on User ID and Raw User's Personality Details **(PATCH)**

```
http://localhost:3000/api/userdatas/update-user-mental-context/:id
```

Sample Request Body
```json
{
  "majorIssues": "Anxiety, stress due to work pressure",
  "recentSymptoms": "Feeling restless, trouble sleeping at night",
  "relationships": {
    "family": "Arguments with parents, lack of emotional support",
    "friends": "Feels distant from close friends, limited social interactions",
    "romantic": "Breakup recently, trust issues"
  },
  "career": {
    "profession": "Software Developer",
    "stressLevel": "High",
    "jobSatisfaction": "Neutral"
  },
  "triggers": "High workload, social gatherings, personal expectations",
  "copingMechanisms": "Listening to music, deep breathing, isolation",
  "supportSystem": {
    "family": false,
    "friends": true,
    "therapist": false
  },
  "medicalHistory": {
    "pastDiagnoses": "Mild depression diagnosed in college",
    "medications": "None"
  },
  "familyHistory": "Father has anxiety disorder, grandmother had depression",
  "lifestyle": {
    "sleepHours": 5,
    "dietQuality": "Average",
    "exerciseFrequency": "Rarely",
    "substanceUse": "Occasional"
  },
  "therapeuticGoals": "Improve focus, reduce anxiety attacks",
  "age": 28,
  "gender": "Male",
  "sex": "Male"
}
```