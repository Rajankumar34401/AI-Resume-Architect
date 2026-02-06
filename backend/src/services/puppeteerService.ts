import puppeteer from 'puppeteer';

export const generatePDF = async (htmlContent: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // High-density screen simulation helps with rendering quality
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }, // Change to 0
    preferCSSPageSize: true,
    displayHeaderFooter: false
  });

  await browser.close();
  return pdfBuffer;
};