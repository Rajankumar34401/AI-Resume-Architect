import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { 
  Download, Loader2, Palette, LayoutDashboard, CheckCircle2, SearchCode 
} from 'lucide-react';
import axios from 'axios';
import { ATSScore } from './ATSScore'; // Ensure this path is correct

export const Preview = () => {
  const { resume } = useResumeStore();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  const [activeTemplate, setActiveTemplate] = useState<'classic' | 'modern'>('classic');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setIsDownloading(true);
    try {
      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(style => style.outerHTML).join('');

      const fullHtml = `
        <html>
          <head>
            ${styles}
            <style>
              @page { size: A4; margin: 0; }
              * { box-sizing: border-box !important; }
              body { margin: 0; padding: 0; background: white !important; }
              .pdf-container { 
                width: 210mm; 
                min-height: 297mm; 
                padding: 20mm; 
                background: white !important;
                color: black !important;
                overflow: hidden;
              }
              .pdf-container * { 
                color: black !important; 
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .text-indigo-600, .text-indigo-900 { color: #1e1b4b !important; }
            </style>
          </head>
          <body>
            <div class="pdf-container">${pdfRef.current.innerHTML}</div>
          </body>
        </html>`;
      
      const response = await axios.post('http://localhost:5000/api/resumes/download', 
        { htmlContent: fullHtml }, 
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.personalInfo.fullName || 'Resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Download failed. Ensure backend is running.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0F172A] overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[380px] min-w-[380px] border-r border-slate-800 bg-[#0F172A] flex flex-col z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
            <LayoutDashboard size={22} />
          </div>
          <h1 className="text-white font-bold truncate">CareerForge <span className="text-indigo-400 font-normal">PRO</span></h1>
        </div>

        {/* SCROLLABLE SIDEBAR CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* TEMPLATES SECTION */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 tracking-widest">
              <Palette size={14} /> Design Templates
            </h3>
            <div className="grid gap-3">
              <button onClick={() => setActiveTemplate('classic')} className={`p-4 rounded-xl border-2 text-left transition-all ${activeTemplate === 'classic' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/40'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-sm">Classic Executive</span>
                  {activeTemplate === 'classic' && <CheckCircle2 size={16} className="text-indigo-400" />}
                </div>
              </button>
              <button onClick={() => setActiveTemplate('modern')} className={`p-4 rounded-xl border-2 text-left transition-all ${activeTemplate === 'modern' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/40'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-sm">Modern Minimal</span>
                  {activeTemplate === 'modern' && <CheckCircle2 size={16} className="text-indigo-400" />}
                </div>
              </button>
            </div>
          </section>

          {/* ATS OPTIMIZER SECTION */}
          <section className="pt-2">
             <ATSScore />
          </section>
        </div>

        {/* BOTTOM DOWNLOAD ACTION */}
        <div className="p-6 border-t border-slate-800 bg-[#0F172A]/80 backdrop-blur-md">
          <button 
            onClick={handleDownloadPDF} 
            disabled={isDownloading} 
            className="w-full py-4 rounded-2xl font-bold bg-indigo-600 text-white flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            {isDownloading ? <Loader2 className="animate-spin" /> : <Download size={20} />}
            Download High-Res PDF
          </button>
        </div>
      </aside>

      {/* PREVIEW AREA */}
      <main className="flex-1 h-full overflow-auto bg-[#1E293B] p-8 flex justify-center items-start custom-scrollbar">
        <div className="scale-[0.85] xl:scale-100 origin-top transition-transform duration-300">
          <div className="relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-10">
            <div 
              ref={pdfRef} 
              className={`bg-white w-[210mm] min-h-[297mm] p-[15mm] text-black shadow-inner ${activeTemplate === 'modern' ? 'font-sans' : 'font-serif'}`}
              style={{ height: 'auto' }}
            >
              {activeTemplate === 'classic' ? (
                /* ... (Classic Template Code Remains Same) ... */
                <div className="h-full">
                  <header className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                    <h1 className="text-3xl font-bold uppercase mb-2 tracking-tight">
                      {resume.personalInfo.fullName || 'Full Name'}
                    </h1>
                    <div className="flex justify-center flex-wrap gap-2 text-[9pt] text-slate-700 font-medium">
                      <span>{resume.personalInfo.email}</span>
                      {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
                      {resume.personalInfo.city && <span>• {resume.personalInfo.city}</span>}
                      {resume.personalInfo.linkedin && (
                        <span>• {resume.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                      )}
                      {resume.personalInfo.github && (
                        <span>• {resume.personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                      )}
                    </div>
                  </header>
                  <section className="mb-6">
                    <h2 className="text-xs font-black uppercase border-b border-slate-300 mb-2 pb-1">Professional Summary</h2>
                    <p className="text-[10pt] leading-relaxed text-justify">{resume.summary}</p>
                  </section>
                  <section className="mb-6">
                    <h2 className="text-xs font-black uppercase border-b border-slate-300 mb-2 pb-1">Education</h2>
                    {resume.education.map(edu => (
                      <div key={edu.id} className="flex justify-between text-[10pt] mb-1">
                        <span><strong>{edu.school}</strong> | {edu.degree}</span>
                        <span>{edu.year} ({edu.score} {edu.scoreType})</span>
                      </div>
                    ))}
                  </section>
                  <section className="mb-6">
                    <h2 className="text-xs font-black uppercase border-b border-slate-300 mb-2 pb-1">Experience</h2>
                    {resume.experience.map(exp => (
                      <div key={exp.id} className="mb-4">
                        <div className="flex justify-between font-bold text-[10.5pt]"><span>{exp.company}</span><span>{exp.duration}</span></div>
                        <p className="italic text-[9.5pt] mb-1">{exp.role}</p>
                        <p className="text-[10pt] whitespace-pre-line leading-snug">{exp.desc}</p>
                      </div>
                    ))}
                  </section>
                  {resume.projects && resume.projects.length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-xs font-black uppercase border-b border-slate-300 mb-2 pb-1">Projects</h2>
                      {resume.projects.map(proj => (
                        <div key={proj.id} className="mb-3">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-[10.5pt]">{proj.name}</h3>
                            <span className="text-[8pt] text-blue-700">{proj.link}</span>
                          </div>
                          <p className="text-[10pt] leading-snug">{proj.desc}</p>
                        </div>
                      ))} 
                    </section>
                  )}
                  <section>
                    <h2 className="text-xs font-black uppercase border-b border-slate-300 mb-2 pb-1">Skills</h2>
                    <p className="text-[10pt]">{resume.skills.join(', ')}</p>
                  </section>
                </div>
              ) : (
                /* ... (Modern Template Code Remains Same) ... */
                <div className="flex h-full w-full gap-10 overflow-hidden" style={{ boxSizing: 'border-box' }}>
                  <aside className="w-1/3 border-r border-slate-100 pr-6 space-y-8 shrink-0">
                    <div className="w-full">
                      <h1 className="text-2xl font-black text-indigo-900 leading-tight mb-4 break-words">
                        {resume.personalInfo.fullName || 'Full Name'}
                      </h1>
                      <div className="text-[9pt] space-y-3">
                        <div className="w-full">
                          <p className="font-bold uppercase text-indigo-600 text-[8px] tracking-[0.2em] mb-2">Contact</p>
                          <div className="space-y-1 text-slate-600 break-words">
                            <p>{resume.personalInfo.email}</p>
                            <p>{resume.personalInfo.phone}</p>
                            <p>{resume.personalInfo.city}</p>
                            {resume.personalInfo.linkedin && (
                              <p className="text-indigo-500 break-all">{resume.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</p>
                            )}
                            {resume.personalInfo.github && (
                              <p className="text-indigo-500 break-all">{resume.personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold uppercase text-indigo-600 text-[8px] tracking-[0.2em] mb-3">Education</p>
                          {resume.education.map(edu => (
                            <div key={edu.id} className="mb-3">
                              <p className="font-bold text-slate-800 text-[9.5pt] leading-tight">{edu.school}</p>
                              <p className="text-slate-500 text-[8pt]">{edu.degree}</p>
                              <p className="text-indigo-500 font-bold text-[7.5pt] mt-0.5">{edu.year} • {edu.score} {edu.scoreType}</p>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="font-bold uppercase text-indigo-600 text-[8px] tracking-[0.2em] mb-3">Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {resume.skills.map((s, i) => (
                              <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 text-[8pt] font-medium">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>
                  <div className="flex-1 py-2 min-w-0">
                    <section className="mb-8">
                      <h2 className="text-[10pt] font-black uppercase text-indigo-900 border-b-2 border-indigo-50 mb-3 pb-1 tracking-wider">Profile</h2>
                      <p className="text-[10pt] leading-relaxed text-slate-700 text-justify break-words">{resume.summary}</p>
                    </section>
                    <section className="mb-8">
                      <h2 className="text-[10pt] font-black uppercase text-indigo-900 border-b-2 border-indigo-50 mb-4 pb-1 tracking-wider">Experience</h2>
                      <div className="space-y-5">
                        {resume.experience.map(exp => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-slate-900 text-[10.5pt]">{exp.role}</h3>
                              <span className="text-[8pt] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">{exp.duration}</span>
                            </div>
                            <p className="text-indigo-700 font-semibold text-[9pt] mb-1">{exp.company}</p>
                            <p className="text-[9.5pt] text-slate-600 whitespace-pre-line leading-snug">{exp.desc}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                    {resume.projects && resume.projects.length > 0 && (
                      <section>
                        <h2 className="text-[10pt] font-black uppercase text-indigo-900 border-b-2 border-indigo-50 mb-4 pb-1 tracking-wider">Key Projects</h2>
                        <div className="space-y-4">
                          {resume.projects.map(proj => (
                            <div key={proj.id}>
                              <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-slate-800 text-[10pt]">{proj.name}</h3>
                                {proj.link && <span className="text-[7.5pt] text-indigo-500 font-medium italic">{proj.link.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                              </div>
                              <p className="text-[9.5pt] text-slate-600 leading-snug">{proj.desc}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};