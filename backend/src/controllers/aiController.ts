import type { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = "gemini-2.5-flash";

// ============================================
// 1. Optimize Resume Summary
// ============================================
export const optimizeSummary = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
You are an expert resume writer.

Task:
Rewrite the text below into a SINGLE professional, ATS-friendly resume summary.

Rules:
- Return ONLY one paragraph
- No headings
- No bullet points
- No options
- No explanations
- No markdown
- Maximum 60 words

Text:
${text}
`;

    const result = await model.generateContent(prompt);
    const optimizedText = result.response.text().replace(/\n+/g, " ").trim();

    return res.json({ optimizedText });

  } catch (error) {
    console.error("Optimize summary error:", error);
    return res.status(500).json({ error: "Optimize failed" });
  }
};

// ============================================
// 2. ATS Score Analysis
// ============================================
export const atsScore = async (req: Request, res: Response) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({
        error: "resumeData and jobDescription are required",
      });
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
Analyze the resume against the job description.

Resume:
${JSON.stringify(resumeData)}

Job Description:
${jobDescription}

Return ONLY valid JSON in this format:
{
  "score": number,
  "feedback": "string",
  "missingKeywords": ["string"]
}
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Remove markdown if AI adds it
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    return res.json(parsed);

  } catch (error) {
    console.error("ATS score error:", error);
    return res.status(500).json({ error: "ATS analysis failed" });
  }
};

// ============================================
// 3. Generate Cover Letter
// ============================================
export const generateCoverLetter = async (req: Request, res: Response) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({
        error: "resumeData and jobDescription are required",
      });
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
Write a professional cover letter based on the resume and job description.

Rules:
- Maximum 300 words
- Professional tone
- No placeholders
- No markdown

Resume:
${JSON.stringify(resumeData)}

Job Description:
${jobDescription}
`;

    const result = await model.generateContent(prompt);
    const coverLetter = result.response.text().trim();

    return res.json({ coverLetter });

  } catch (error) {
    console.error("Cover letter error:", error);
    return res.status(500).json({ error: "Cover letter generation failed" });
  }
};
