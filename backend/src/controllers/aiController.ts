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

router.post('/ats-score', async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using 1.5-flash for speed/cost

    const prompt = `
  You are an expert ATS Analyst. Compare the following Resume Data with the Job Description.
  
  Resume Data: ${JSON.stringify(resumeData)}
  Job Description: ${jobDescription}

  INSTRUCTIONS:
  1. Calculate a match score (0-100).
  2. Identify the top 5-8 missing "Hard Skills" or "Tools" from the JD that are not in the resume.
  3. Ignore generic words; focus on industry-specific keywords (e.g., "GraphQL", "Agile", "AWS").
  
  Return ONLY a JSON object:
  {
    "score": number,
    "feedback": "Concise, professional advice",
    "missingKeywords": ["Skill1", "Skill2", "Skill3"]
  }
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("ATS Error:", error);
    res.status(500).json({ error: "ATS Analysis failed" });
  }
});

router.post('/generate-cover-letter', async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Write a professional cover letter based on this Resume: ${JSON.stringify(resumeData)} 
    and this Job Description: ${jobDescription}. 
    Keep it under 300 words and focus on matching skills to requirements. 
    Use a professional tone and do not use generic placeholders.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ coverLetter: response.text().trim() });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

export default router;