import express from 'express'; // Default import
import { generatePDF } from '../services/puppeteerService.js';

export const downloadPdf = async (req: express.Request, res: express.Response) => {
  try {
    const { htmlContent } = req.body;
    if (!htmlContent) return res.status(400).json({ error: "htmlContent is required" });

    const buffer = await generatePDF(htmlContent);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=resume.pdf',
    });

    res.send(buffer);
  } catch (error) {
    console.error("PDF Error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};