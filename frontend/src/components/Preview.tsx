import React, { useRef, useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { Mail, Phone, MapPin, Github, Linkedin, Download, SearchCheck, BrainCircuit } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';

export const Preview = () => {
  const { resume } = useResumeStore();
  const pdfRef = useRef<HTMLDivElement>(null);

  // --- ATS STATES ---
  const [jobDescription, setJobDescription] = useState(''); 
  const [atsResult, setAtsResult] = useState<any>(null);    
  const [loading, setLoading] = useState(false);

  // --- DOWNLOAD LOGIC (Using react-to-print to avoid oklch error) ---
  const handlePrint = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: `${resume.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}`,
  });

  // --- ATS API CALL ---
  const checkATS = async () => {
    if (!jobDescription) return alert("Pehle Job Description paste karo!");
    setLoading(true);
    try {
      // Backend (src folder 1) ko data bhejna [cite: 2025-12-29]
      const response = await axios.post('http://localhost:5000/api/ats-score', {
        resumeData: resume,
        jobDescription: jobDescription
      });
      setAtsResult(response.data);
    } catch (err) {
      console.error("ATS Error:", err);
      alert("Backend check karo (npm run dev), score nahi mil raha!");
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 bg-slate-200/50 p-8 overflow-auto flex flex-col items-center custom-scrollbar">
      
      {/* 1. ATS ANALYZER UI */}
      <div className="w-full max-w-[210mm] bg-white p-6 rounded-2xl shadow-lg mb-8 border border-indigo-100">
        <div className="flex items-center gap-2 mb-4 text-indigo-700">
          <BrainCircuit size={24} />
          <h3 className="text-xl font-bold">AI ATS Optimizer</h3>
        </div>
        
        <textarea 
          placeholder="Paste Job Description here to check your match score..."
          className="w-full p-4 border border-slate-200 rounded-xl h-28 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        
        <div className="flex gap-4 mt-4">
          <button 
            onClick={checkATS}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Analyzing..." : <><SearchCheck size={20}/> Check ATS Score</>}
          </button>
          
          <button 
            onClick={() => handlePrint()}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Download size={20} /> Download PDF
          </button>
        </div>

        {/* ATS RESULTS DISPLAY */}
        {atsResult && (
          <div className="mt-6 p-5 bg-indigo-50 rounded-xl border border-indigo-100 animate-in fade-in duration-500">
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-indigo-700">{atsResult.score}%</span>
              <span className="text-indigo-500 font-bold pb-1 text-sm">Match Probability</span>
            </div>
            <p className="text-slate-700 text-sm mb-4 leading-relaxed italic">" {atsResult.feedback} "</p>
            
            <div className="flex flex-wrap gap-2">
              {atsResult.missingKeywords?.map((skill: string) => (
                <span key={skill} className="bg-white text-red-600 border border-red-100 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  + Add: {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. ACTUAL RESUME PREVIEW (A4 Page) */}
      <div className="origin-top shadow-2xl scale-[0.6] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100 mb-20">
        <div 
          ref={pdfRef}
          className="w-[210mm] min-h-[297mm] bg-white p-[20mm] text-black flex flex-col font-serif box-border overflow-hidden print:p-[15mm] print:shadow-none"
        >
          {/* HEADER SECTION */}
          <section className="mb-2 w-full text-center">
            <h1 className="text-3xl font-bold uppercase tracking-wide mb-3">
              {resume.personalInfo.fullName || "Your Name"}
            </h1>

            <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-[9pt] mb-4 w-full">
              {resume.personalInfo.city && <span className="flex items-center gap-1"><MapPin size={10}/> {resume.personalInfo.city}</span>}
              {resume.personalInfo.email && <span className="flex items-center gap-1"><Mail size={10}/> {resume.personalInfo.email}</span>}
              {resume.personalInfo.phone && <span className="flex items-center gap-1"><Phone size={10}/> {resume.personalInfo.phone}</span>}
              {resume.personalInfo.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin size={10}/> {resume.personalInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?/, '')}
                </span>
              )}
              {resume.personalInfo.github && (
                <span className="flex items-center gap-1">
                  <Github size={10}/> {resume.personalInfo.github.replace(/^(https?:\/\/)?(www\.)?/, '')}
                </span>
              )}
            </div>

            {resume.summary && (
              <div className="w-full pb-4 text-justify break-words">
                <p className="text-[10pt] leading-relaxed italic text-gray-800">
                  {resume.summary}
                </p>
              </div>
            )}
          </section>

          {/* EDUCATION SECTION */}
          {resume.education.length > 0 && (
            <section className="mb-5 w-full text-left">
              <h2 className="text-[11pt] font-bold border-b-[1.5px] border-black pb-0.5 mb-2 uppercase tracking-tight">Education</h2>
              {resume.education.map((edu: any) => (
                <div key={edu.id} className="mb-3 text-[10pt] w-full">
                  <div className="flex justify-between items-baseline font-bold w-full">
                    <span className="uppercase flex-1 break-words mr-4">{edu.school}</span>
                    <span className="italic font-medium text-gray-700 whitespace-nowrap">{edu.year}</span>
                  </div>
                  <div className="text-[9.5pt] w-full break-words italic">
                    {edu.degree} {edu.score && `| ${edu.scoreType || "CGPA"}: ${edu.score}`}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* EXPERIENCE SECTION */}
          {resume.experience && resume.experience.length > 0 && (
            <section className="mb-5 w-full text-left">
              <h2 className="text-[11pt] font-bold border-b-[1.5px] border-black pb-0.5 mb-2 uppercase tracking-tight">Experience</h2>
              {resume.experience.map((exp: any) => (
                <div key={exp.id} className="mb-4 w-full">
                  <div className="flex justify-between items-baseline w-full font-bold">
                    <span className="text-[10.5pt] uppercase">{exp.role}</span>
                    <span className="italic font-medium text-gray-700 text-[9.5pt] whitespace-nowrap">{exp.duration}</span>
                  </div>
                  <div className="text-blue-700 font-bold italic text-[9.5pt] mb-1">{exp.company}</div>
                  {exp.desc && <p className="text-[9.5pt] text-justify leading-snug">• {exp.desc}</p>}
                </div>
              ))}
            </section>
          )}

          {/* PROJECTS SECTION */}
          {resume.projects.length > 0 && (
            <section className="mb-5 w-full text-left">
              <h2 className="text-[11pt] font-bold border-b-[1.5px] border-black pb-0.5 mb-2 uppercase tracking-tight">Projects</h2>
              {resume.projects.map((proj: any) => (
                <div key={proj.id} className="mb-3 w-full">
                  <div className="flex justify-between items-start w-full font-bold">
                    <span className="text-[10.5pt] uppercase">{proj.name}</span>
                    {proj.link && <span className="text-[8.5pt] text-blue-700 underline italic">{proj.link.replace(/^(https?:\/\/)?(www\.)?/, '')}</span>}
                  </div>
                  {proj.desc && <p className="text-[9.5pt] mt-1 text-justify leading-snug">• {proj.desc}</p>}
                </div>
              ))}
            </section>
          )}

          {/* SKILLS SECTION */}
          {resume.skills.length > 0 && (
            <section className="mb-5 w-full text-left">
              <h2 className="text-[11pt] font-bold border-b-[1.5px] border-black pb-0.5 mb-2 uppercase tracking-tight">Skills</h2>
              <div className="text-[10pt] w-full text-justify">
                <span className="font-bold">Technical Skills:</span> {resume.skills.join(', ')}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};