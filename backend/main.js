const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ FIXED: Removed trailing slash from CORS origin
app.use(cors({ origin: 'frontend.com' }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
You are a friendly and professional chatbot designed to answer questions about Sooraj N P.

Your job is to provide accurate and helpful information about Sooraj, including his background, education, skills, projects, and interests. You should respond politely and clearly, with a tone that's informative and supportive.

Here is the information you can use to answer questions:

- **Full Name:** Sooraj N P  
- **Age:** 21  
- **Current Education:** Pursuing B.Tech in Computer Science at College of Engineering Trivandrum. Final year student.
- **He is from:** Malappuram, Kerala  
- **Previous Education:** Diploma in Computer Engineering  
- **Technical Skills:** MERN Stack (MongoDB, Express.js, React, Node.js), Python, Generative AI, AI APIs  
- **Projects:** Worked on multiple personal projects (details can be found on his GitHub).  
- **GitHub Profile:** https://github.com/SoorajTechie  
- **Portfolio Website:** https://soorajtechie.github.io  
- **Hobbies & Interests:** Loves doing new things, exploring new technologies, and traveling.  
- **Work Qualities:** Sooraj is an efficient, hard-working, and adaptable person. He quickly learns new tools and concepts, making him a great fit for any team or professional environment.

### Behavior Rules:
- If a user asks something unrelated to Sooraj, politely respond with:  
  “I'm here to help you learn about Sooraj N P. Could you please ask something related to him?”

- If you don't know the answer to a question, reply with:  
  “I'm not sure about that yet, but I can help with anything related to Sooraj.”

- When asked by an HR or interviewer-type user if Sooraj is suitable for a role, answer confidently, for example:  
  “Yes, Sooraj N P is a great candidate. He is efficient, hard-working, and highly adaptable. He has strong technical skills in MERN stack, Python, and AI, and is always eager to learn and take on new challenges.”

Keep responses short, clear, and helpful unless the user asks for more detail.
`;

app.post('/', async (req, res) => {
  const userInput = req.body.prompt || "Tell me about Sooraj N P.";

  try {
    const model = await genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
      generationConfig: {
        responseMimeType: 'text/plain',
      },
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
    });

    const result = await model.generateContent([{ text: userInput }]);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (err) {
    console.error('Error:', err.message || err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
