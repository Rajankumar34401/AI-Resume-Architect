import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.post('/optimize-summary', async (req, res) => {
  try {
    const { text } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
   const prompt = `You are an expert resume writer. 
Rewrite the following text to be professional and ATS-friendly.
CRITICAL INSTRUCTIONS:
- Provide ONLY the rewritten content.
- Do NOT include any introductory text, options, explanations, or conversational filler.
- Do NOT use conversational phrases like "Here are a few options".
- Keep it under 50-60 words.
Text to rewrite: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ optimizedText: response.text() });
  } catch (error) {
    res.status(500).json({ error: "AI Optimization failed" });
  }
});

export default router;