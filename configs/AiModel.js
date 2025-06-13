const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Write a script to generate 30 seconds video on topic :Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field, No Plain text",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  {\n    "imagePrompt": "A bustling marketplace in ancient Rome, with people selling goods, merchants haggling, and citizens going about their daily lives. Realistic, detailed, and vibrant colors.",\n    "ContentText": "Welcome to ancient Rome, a city buzzing with life and commerce. Imagine a bustling marketplace, filled with the cries of vendors and the chatter of citizens."\n  },\n  {\n    "imagePrompt": "A portrait of a Roman senator, stern and powerful, wearing a toga and sitting on a marble throne. Realistic, with sharp details and a sense of authority.",\n    "ContentText": "Among them, a powerful senator named Cato the Younger, known for his strong principles and unwavering patriotism."\n  },\n  {\n    "imagePrompt": "A dramatic scene of a Roman Senate meeting, with senators debating and arguing passionately. Realistic, with detailed clothing and expressions of intense emotion.",\n    "ContentText": "One day, a heated debate erupted in the Roman Senate. Cato, a staunch defender of Roman tradition, fiercely opposed a proposal to grant citizenship to a new group of people."\n  },\n  {\n    "imagePrompt": "A close-up shot of Cato\'s face, with furrowed brows and a determined expression. Realistic, showing the intensity of his argument.",\n    "ContentText": "His voice boomed, \'These foreigners threaten our way of life! They are not Romans, and they should not be granted citizenship!\'"\n  },\n  {\n    "imagePrompt": "A scene of chaos and commotion in the Senate, with senators shouting and gesturing wildly. Realistic, depicting the passion and drama of the debate.",\n    "ContentText": "The senators erupted in a frenzy, some agreeing with Cato, others passionately defending the proposal."\n  },\n  {\n    "imagePrompt": "A close-up shot of a Roman soldier, wearing armor and holding a sword, standing guard in the Senate chamber. Realistic and imposing.",\n    "ContentText": "As the debate raged on, a soldier stood guard at the entrance, ensuring order within the hallowed halls of the Senate."\n  },\n  {\n    "imagePrompt": "A sweeping view of the Roman Forum, with its majestic buildings and bustling crowds. Realistic and grand, showcasing the power and splendor of the Roman Empire.",\n    "ContentText": "In the heart of the Roman Empire, this debate had consequences far beyond the Senate walls."\n  }\n]\n```',
        },
      ],
    },
  ],
});
