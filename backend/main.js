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

const SYSTEM_INSTRUCTION = `Give your instructions `;

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
