import { useState } from "react";
import { useResumeStore } from "../store/useResumeStore";
import { aiService, resumeService } from "../services/Api";

interface ATSResult {
  score: number;
  feedback: string;
  missingKeywords: string[];
}

export const ATSScore = () => {
  const { resume, updateSkills } = useResumeStore();

  const [jd, setJd] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [coverLetter, setCoverLetter] = useState("");
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Flatten all skills
  const flatSkills = resume.skills.flatMap((s) => s.skills);

  // Inject single keyword
  const handleInject = (keyword: string) => {
    if (flatSkills.includes(keyword)) return;

    const updatedSkills = [...resume.skills];
    const generalIndex = updatedSkills.findIndex(
      (s) => s.category === "Technical Skills" || s.category === "General"
    );

    if (generalIndex > -1) {
      updatedSkills[generalIndex] = {
        ...updatedSkills[generalIndex],
        skills: [...updatedSkills[generalIndex].skills, keyword],
      };
    } else {
      updatedSkills.push({
        id: crypto.randomUUID(),
        category: "Technical Skills",
        skills: [keyword],
      });
    }

    updateSkills(updatedSkills);

    if (result) {
      setResult({
        ...result,
        missingKeywords: result.missingKeywords.filter((k) => k !== keyword),
      });
    }
  };

  const injectAll = () => {
    if (!result?.missingKeywords) return;
    result.missingKeywords.forEach(handleInject);
  };

  // ==============================
  // ATS Score
  // ==============================
  const analyzeATS = async () => {
    if (!jd) return;
    setLoading(true);
    try {
      const res = await aiService.getATSScore(resume, jd);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing resume! Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Generate Cover Letter
  // ==============================
  const generateCoverLetter = async () => {
    if (!jd) return;
    setIsGeneratingCL(true);
    try {
      const res = await aiService.generateCoverLetter(resume, jd);
      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      console.error(err);
      alert("Failed to generate cover letter.");
    } finally {
      setIsGeneratingCL(false);
    }
  };

  // ==============================
  // Download Cover Letter PDF
  // ==============================
  const downloadCoverLetterPDF = async () => {
  if (!coverLetter) return;
  setIsDownloading(true);

  try {
    // Prepare HTML content for PDF
    const coverLetterHTML = `
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
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">${resume.personalInfo.name}</div>
            <div class="contact">
              ${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}
            </div>
          </div>
          <div class="content">
            <div class="date">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            ${coverLetter.replace(/\n/g, '<br/>')}
          </div>
        </body>
      </html>
    `;

    // Call backend downloadPDF
    const res = await resumeService.downloadPDF(coverLetterHTML);

    // Create download link
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${resume.personalInfo.name}_Cover_Letter.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (err) {
    console.error(err);
    alert("Error generating PDF. Check backend.");
  } finally {
    setIsDownloading(false);
  }
};

  // ==============================
  // JSX
  // ==============================
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
                Add Skills
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
              {result.missingKeywords?.map((k) => (
                <button
                  key={k}
                  onClick={() => handleInject(k)}
                  className="group flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-[10px] hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/40 transition-all"
                >
                  <span>+</span>
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {coverLetter && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <div className="bg-[#0F172A] border border-slate-800 p-8 rounded-2xl max-w-2xl w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">AI Drafted Cover Letter</h3>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 max-h-[50vh] overflow-y-auto mb-6">
              <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed font-serif">
                {coverLetter}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(coverLetter);
                    alert("Copied!");
                  } catch {
                    alert("Failed to copy text");
                  }
                }}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all border border-slate-700"
              >
                Copy Text
              </button>

              <button
                onClick={downloadCoverLetterPDF}
                disabled={isDownloading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {isDownloading ? "Generating..." : "Download PDF"}
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
