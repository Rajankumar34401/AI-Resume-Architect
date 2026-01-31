import puppeteer from 'puppeteer';

export const generatePDF = async (htmlContent: string) => {
  const browser = await puppeteer.launch({
    headless: true, // "new" is also an option depending on version
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Critical for many server environments
  });

  const page = await browser.newPage();
  
  // Set content and wait until the network is idle (fonts/styles loaded)
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
  });

  await browser.close();
  return pdfBuffer;
};
