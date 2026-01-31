import { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import axios from 'axios';

export const ATSScore = () => {
  const { resume, updateSkills } = useResumeStore();
  
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [coverLetter, setCoverLetter] = useState("");
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // New state for PDF generation

 const handleInject = (keyword: string) => {

    if (resume.skills.includes(keyword)) return;

    const updatedSkills = [...resume.skills, keyword];

    updateSkills(updatedSkills);



    if (result) {

      setResult({

        ...result,

        missingKeywords: result.missingKeywords.filter((k: string) => k !== keyword)

      });

    }

  };


  const injectAll = () => {
    if (!result?.missingKeywords) return;
    const uniqueNewKeywords = result.missingKeywords.filter(
      (k: string) => !resume.skills.includes(k)
    );
    const finalSkills = [...resume.skills, ...uniqueNewKeywords];
    updateSkills(finalSkills);
    setResult({ ...result, missingKeywords: [] });
  };

  const analyzeATS = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ats-score', {
        resumeData: resume,
        jobDescription: jd
      });
      setResult(res.data);
    } catch (err) {
      alert("Error analyzing resume!");
      console.error(err);
    }
    setLoading(false);
  };

  const generateCoverLetter = async () => {
    setIsGeneratingCL(true);
    try {
      const res = await axios.post('http://localhost:5000/api/generate-cover-letter', {
        resumeData: resume,
        jobDescription: jd
      });
      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      alert("Failed to generate cover letter.");
      console.error(err);
    } finally {
      setIsGeneratingCL(false);
    }
  };

  // NEW: Function to generate Executive PDF using Puppeteer
  const downloadCoverLetterPDF = async () => {
    setIsDownloading(true);
    const styledHtml = `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 60px; line-height: 1.8; color: #1e293b; background: white; }
            .header { text-align: center; border-bottom: 1.5px solid #000; padding-bottom: 20px; margin-bottom: 40px; }
            .name { font-family: 'Playfair Display', serif; font-size: 32px; text-transform: uppercase; letter-spacing: 3px; font-weight: 700; }
            .contact { font-size: 11px; color: #475569; margin-top: 8px; letter-spacing: 1px; }
            .content { font-size: 13px; text-align: justify; color: #334155; }
            .date { margin-bottom: 30px; font-weight: 600; color: #000; }
            @media print { section { break-inside: avoid; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">${resume.personalInfo.fullName}</div>
            <div class="contact">
              ${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.city}
            </div>
          </div>
          <div class="content">
            <div class="date">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            ${coverLetter.replace(/\n/g, '<br/>')}
          </div>
        </body>
      </html>
    `;

    try {
      const res = await axios.post('http://localhost:5000/api/resumes/download', 
        { htmlContent: styledHtml }, 
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.personalInfo.fullName}_Cover_Letter.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Error generating PDF. Check backend.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 mt-2 shadow-inner w-full">
      <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
        ATS Optimizer
      </h3>
      
      <textarea 
        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 h-28 mb-3 text-sm text-slate-300 outline-none focus:border-indigo-500 transition-all resize-none"
        placeholder="Paste Job Description here..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />
      
      <div className="flex flex-col gap-2">
        <button 
          onClick={analyzeATS}
          disabled={loading || !jd}
          className="w-full bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 py-2 rounded-xl text-sm font-bold hover:bg-indigo-600/20 transition-all disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Calculate ATS Score"}
        </button>

        <button 
          onClick={generateCoverLetter}
          disabled={isGeneratingCL || !jd}
          className="w-full bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600/20 transition-all disabled:opacity-50"
        >
          {isGeneratingCL ? "Drafting Letter..." : "Generate AI Cover Letter"}
        </button>
      </div>

      {result && (
        <div className="mt-5 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-black text-white">{result.score}%</span>
              <p className="text-[10px] text-indigo-400 font-bold uppercase">Match</p>
            </div>
            
            {result.missingKeywords?.length > 0 && (
              <button 
                onClick={injectAll}
                className="text-[10px] bg-indigo-500 text-white px-3 py-1 rounded-full hover:bg-indigo-400 transition-colors font-bold"
              >
                Add All Skills
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mb-4 border-l-2 border-indigo-500 pl-2">
            {result.feedback}
          </p>

          <div className="space-y-2">
            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">
              Missing Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords?.map((k: string) => (
                <button
                  key={k}
                  onClick={() => handleInject(k)}
                  className="group flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-[10px] hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/40 transition-all"
                >
                  <span className="opacity-50 group-hover:opacity-100">+</span>
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {coverLetter && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-[#0F172A] border border-slate-800 p-8 rounded-2xl max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-bold text-white mb-2">AI Drafted Cover Letter</h3>
            <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest">Week 4 Delivery: CareerForge Pro</p>
            
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 max-h-[50vh] overflow-y-auto mb-6 shadow-inner">
              <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed font-serif">
                {coverLetter}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(coverLetter);
                  alert("Copied to clipboard!");
                }}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all border border-slate-700"
              >
                Copy Text
              </button>
              
              {/* NEW: Download Button using Puppeteer logic */}
              <button 
                onClick={downloadCoverLetterPDF}
                disabled={isDownloading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
              >
                {isDownloading ? "Generating PDF..." : "Download PDF"}
              </button>
              
              <button 
                onClick={() => setCoverLetter("")}
                className="px-6 py-3 text-slate-500 hover:text-white transition-all font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};