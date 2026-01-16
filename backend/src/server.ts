import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
// Import path fix: server.ts aur controller dono src ke andar hain [cite: 2025-12-29]
import aiRoutes from './controllers/aiController.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 1. Register AI Routes (Jo aapne aiController.ts mein likhe hain)
// Isse frontend ka /api/optimize-summary kaam karega
app.use('/api', aiRoutes);

// 2. Aapka Purana Rewrite Logic (Backup ke liye)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// --- ATS SCORE ROUTE (Fixed Version) ---
app.post('/api/ats-score', async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    // IMPORTANT: Yahan model define karna zaroori hai
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Act as an expert Applicant Tracking System (ATS). 
      Analyze the following Resume against the Job Description.
      
      Resume Data: ${JSON.stringify(resumeData)}
      Job Description: ${jobDescription}

      Provide the analysis ONLY in JSON format:
      {
        "score": (a number between 0-100),
        "missingKeywords": ["keyword1", "keyword2"],
        "feedback": "short summary of what to improve"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON extraction logic to handle extra text from AI
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      res.json(JSON.parse(jsonMatch[0]));
    } else {
      throw new Error("Invalid AI Response Format");
    }
    
  } catch (error) {
    console.error("ATS Error:", error);
    res.status(500).json({ 
      score: 0, 
      missingKeywords: [], 
      feedback: "AI could not process this request. Check your API Key." 
    });
  }
});

app.post('/api/rewrite', async (req, res) => {
  try {
    const { text, type } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a professional resume writer.
    Rewrite the following ${type} text to be more professional, impactful, and concise.
    Use strong action verbs and industry-standard keywords.
    Text to rewrite: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ rewrittenText: response.text() });
  } catch (error) {
    console.error("Rewrite Error:", error);
    res.status(500).json({ error: "AI Rewrite failed." });
  }
});

// 3. Health Check Route
app.get('/', (req, res) => {
  res.send("CareerForge Pro Backend (TS) is running from src folder!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on http://localhost:${PORT}`);
  console.log(`✅ Controller Route: http://localhost:${PORT}/api/optimize-summary`);
  console.log(`✅ Legacy Route: http://localhost:${PORT}/api/rewrite`);
});

