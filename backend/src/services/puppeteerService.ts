import puppeteer from 'puppeteer';

export const generatePDF = async (htmlContent: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    // REMOVE format: 'A4' -> This forces the 297mm height even if content is shorter
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true, // This will now correctly respect your @page { size: A4 }
    displayHeaderFooter: false,
    // ADD THIS: It ensures the background colors/images are captured correctly
    omitBackground: false 
  });

  await browser.close();
  return pdfBuffer;
};