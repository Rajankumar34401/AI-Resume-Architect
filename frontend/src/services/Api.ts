const API_URL = 'http://localhost:5000/api';

export const rewriteExperience = async (text: string) => {
  try {
    const response = await fetch('http://localhost:5000/api/rewrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    return data.rewritten;
  } catch (error) {
    console.error("AI Rewrite Error:", error);
    return text; // Error ki surat mein purana text hi wapas kar dein
  }
};