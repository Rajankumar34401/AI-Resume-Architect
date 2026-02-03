import express from 'express';
import { generatePDF } from '../services/puppeteerService.js';
import Resume from '../models/resume.js';
import { getResumeHTML } from '../utils/resumeTemplate.js'; // Import the template

export const downloadPdf = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    let htmlToRender = "";

    if (id) {
      // Fetch from DB for Dashboard
      const resumeData = await Resume.findById(id).lean();
      if (!resumeData) return res.status(404).json({ error: "Resume not found" });
      
      // Use the Template Function
      htmlToRender = getResumeHTML(resumeData);
    } else {
      // Use direct HTML from Preview
      htmlToRender = req.body.htmlContent;
    }

    if (!htmlToRender) return res.status(400).json({ error: "No content provided" });

    const buffer = await generatePDF(htmlToRender);

    res.contentType("application/pdf");
    res.send(buffer);
  } catch (error) {
    console.error("PDF Error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};