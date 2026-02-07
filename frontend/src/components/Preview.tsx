import { useRef, useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { Download, Loader2, Palette, LayoutDashboard } from 'lucide-react';
import { ATSScore } from './ATSScore';
import toast from 'react-hot-toast';
import { resumeService } from '../services/Api';

export const Preview = () => {
  const { resume } = useResumeStore();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [activeTemplate, setActiveTemplate] = useState<'classic' | 'modern'>('classic');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
  if (!pdfRef.current || !resume.personalInfo?.name) {
    toast.error("Please enter your name first");
    return;
  }

  setIsDownloading(true);
  const downloadPromise = async () => {
    const resumeHtml = pdfRef.current?.innerHTML;
    
    // Capture current styles but we will override them for the PDF
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML).join('');

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          ${styles}
          <style>
          @page { 
            size: A4; 
            margin: 0; 
          }
          body { 
            margin: 0; 
            padding: 0; 
            background: white !important; 
            width: 210mm;
            /* Force browser to use high-quality color rendering */
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .pdf-container { 
            width: 210mm; 
            height: auto !important; 
            min-height: 297mm; 
            background: white !important; 
            padding: 15mm !important; 
            box-sizing: border-box !important;
          }

          /* FORCE PURE BLACK FOR ALL TEXT EXCEPT ACCENTS */
          p, span, li, h3 {
            color: #1e293b !important; /* Slate-800 equivalent for readability */
            opacity: 1 !important;
          }

          /* TARGETING HEADERS (The 'SUZZAN NAAZ' and Section titles) */
          h1, h2, .text-indigo-900 {
            color: #1e1b4b !important; /* Indigo-950 for that deep, sharp look */
            -webkit-text-fill-color: #1e1b4b !important;
            font-weight: 900 !important;
          }

          /* TARGETING SIDEBAR ACCENTS (The Indigo-600 headers) */
          .text-indigo-600, .text-indigo-700 {
            color: #4338ca !important; /* Indigo-700 hex */
            -webkit-text-fill-color: #4338ca !important;
          }

          /* REINFORCE BORDERS (The lines under Profile/Contact) */
          .border-b-2, .border-b {
            border-color: #1e1b4b !important; /* Match the deep indigo */
            border-bottom-width: 1.5pt !important;
            opacity: 1 !important;
          }

          /* SIDEBAR VERTICAL DIVIDER FIX */
          .border-r {
            border-color: #f1f5f9 !important; /* Keep it subtle but visible */
            border-right-width: 1pt !important;
          }

          section { 
            break-inside: avoid !important; 
            margin-bottom: 1.2rem !important; 
          }
        </style>
        </head>
        <body>
          <div class="pdf-container">
            ${resumeHtml}
          </div>
        </body>
      </html>`;

    const response = await resumeService.downloadPDF(fullHtml);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${resume.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  try {
    await toast.promise(downloadPromise(), {
      loading: 'Generating high-contrast PDF...',
      success: 'Downloaded successfully! 🎉',
      error: 'Generation failed.',
    });
  } finally {
    setIsDownloading(false);
  }
};

  return (
    <div className="flex h-screen w-full bg-[#0F172A] overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-95 min-w-95 border-r border-slate-800 bg-[#0F172A] flex flex-col z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
            <LayoutDashboard size={22} />
          </div>
          <h1 className="text-white font-bold">CareerForge <span className="text-indigo-400 font-normal">PRO</span></h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
              <Palette size={14} /> Design Templates
            </h3>
            <div className="grid gap-3">
              <button onClick={() => setActiveTemplate('classic')} className={`p-4 rounded-xl border-2 text-left transition-all ${activeTemplate === 'classic' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/40'}`}>
                <span className="text-white font-bold text-sm">Classic Executive</span>
              </button>
              <button onClick={() => setActiveTemplate('modern')} className={`p-4 rounded-xl border-2 text-left transition-all ${activeTemplate === 'modern' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/40'}`}>
                <span className="text-white font-bold text-sm">Modern Minimal</span>
              </button>
            </div>
          </section>

          <section className="pt-2">
             <ATSScore />
          </section>
        </div>

        <div className="p-6 border-t border-slate-800 bg-[#0F172A]/80">
          <button 
            onClick={handleDownload} 
            disabled={isDownloading} 
            className="w-full py-4 rounded-2xl font-bold bg-indigo-600 text-white flex items-center justify-center gap-2 hover:bg-indigo-500 disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="animate-spin" /> : <Download size={20} />}
            Download High-Res PDF
          </button>
        </div>
      </aside>

      {/* PREVIEW AREA */}
      <main className="flex-1 h-full overflow-auto bg-[#1E293B] p-8 flex justify-center items-start custom-scrollbar">
        <div className="scale-[0.85] xl:scale-100 origin-top transition-transform duration-300">
          <div className="relative shadow-2xl mb-10">
            <div 
              ref={pdfRef} 
              className={`bg-white w-[210mm] min-h-[297mm] p-[15mm] text-black shadow-inner ${activeTemplate === 'modern' ? 'font-sans' : 'font-serif'}`}
            >
              {activeTemplate === 'classic' ? (
                /* CLASSIC TEMPLATE */
                <div className="h-full">
                  <header className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                    <h1 className="text-3xl font-bold uppercase mb-2 tracking-tight">
                      {resume.personalInfo?.name || 'Your Name'}
                    </h1>
                    {(resume.personalInfo?.email || resume.personalInfo?.phone || resume.personalInfo?.location) && (
                      <div className="flex justify-center flex-wrap gap-2 text-[9pt] text-slate-700 font-medium">
                        {resume.personalInfo?.email && <span>{resume.personalInfo.email}</span>}
                        {resume.personalInfo?.phone && <span>• {resume.personalInfo.phone}</span>}
                        {resume.personalInfo?.location && <span>• {resume.personalInfo.location}</span>}
                      </div>
                    )}
                  </header>

                  {resume.summary && (
                    <section className="mb-6">
                      <h2 className="text-xs font-black uppercase border-b border-slate-300 mb-2 pb-1 text-slate-900">Professional Summary</h2>
                      <p className="text-[10pt] leading-relaxed text-justify">{resume.summary}</p>
                    </section>
                  )}

                  {resume.education?.length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-xs font-black uppercase border-b border-slate-300 mb-2 pb-1 text-slate-900">Education</h2>
                      {resume.education.map(edu => (
                        <div key={edu.id} className="mb-2">
                          <div className="flex justify-between text-[10pt]">
                            <span><strong>{edu.institution}</strong> {edu.degree && `| ${edu.degree}`}</span>
                            <span className="text-slate-600">{edu.startDate} — {edu.endDate}</span>
                          </div>
                        </div>
                      ))}
                    </section>
                  )}

                  {resume.experience?.length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-xs font-black uppercase border-b border-slate-300 mb-2 pb-1 text-slate-900">Experience</h2>
                      {resume.experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                          <div className="flex justify-between font-bold text-[10.5pt]">
                            <span>{exp.company}</span>
                            <span className="text-slate-600 font-normal">{exp.startDate} — {exp.endDate || 'Present'}</span>
                          </div>
                          {exp.position && <p className="italic text-[9.5pt] mb-1">{exp.position}</p>}
                          <ul className="list-disc ml-4 text-[10pt] space-y-1">
                            {exp.responsibilities?.map((res, i) => res && <li key={i}>{res}</li>)}
                          </ul>
                        </div>
                      ))}
                    </section>
                  )}

                 {/* Use ?.length and explicitly compare to > 0 */}
                    {resume.projects && resume.projects.length > 0 && (
                      <section className="mb-6">
                        <h2 className="text-xs font-black uppercase border-b border-slate-300 mb-2 pb-1 text-slate-900">
                          Projects
                        </h2>
                        {resume.projects.map((proj) => (
                          <div key={proj.id} className="mb-3">
                            <p className="text-[10pt] font-bold">{proj.name}</p>
                            <p className="text-[9.5pt] text-slate-700">{proj.description}</p>
                          </div>
                        ))}
                      </section>
                    )}

                  {resume.skills && resume.skills.length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-xs font-black uppercase border-b border-slate-300 mb-2 pb-1 text-slate-900">Skills</h2>
                      <p className="text-[10pt] leading-relaxed">
                        {resume.skills.map(s => s.name).filter(Boolean).join(' • ')}
                      </p>
                    </section>
                  )}

                  {/* Corrected logic for TypeScript Strict Mode */}
                  {(resume.certifications ?? []).length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-xs font-black uppercase border-b border-slate-300 mb-2 pb-1 text-slate-900">
                        Certifications
                      </h2>
                      {resume.certifications?.map((cert) => (
                        <p key={cert.id} className="text-[10pt]">
                          <span className="font-bold">{cert.name}</span> 
                          {cert.issuer && ` — ${cert.issuer}`}
                        </p>
                      ))}
                    </section>
                  )}
                </div>
              ) : (
                /* MODERN TEMPLATE */
                <div className="flex h-full w-full gap-8 min-h-[297mm]">
                  <aside className="w-1/3 border-r border-slate-100 pr-6 space-y-8 shrink-0">
                    <div>
                      <h1 className="text-2xl font-black text-indigo-900 mb-4 uppercase leading-tight">
                        {resume.personalInfo?.name || "Your Name"}
                      </h1>
                      
                      <div className="text-[9pt] space-y-6">
                        {(resume.personalInfo?.email || resume.personalInfo?.phone || resume.personalInfo?.location) && (
                          <section>
                            <p className="font-bold uppercase text-indigo-600 text-[8px] tracking-widest mb-2 border-b border-indigo-50 pb-1">Contact</p>
                            <div className="text-slate-600 space-y-1">
                              {resume.personalInfo?.email && <p>{resume.personalInfo.email}</p>}
                              {resume.personalInfo?.phone && <p>{resume.personalInfo.phone}</p>}
                              {resume.personalInfo?.location && <p>{resume.personalInfo.location}</p>}
                            </div>
                          </section>
                        )}
                        
                        {resume.skills && resume.skills.length > 0 && (
                          <section>
                            <p className="font-bold uppercase text-indigo-600 text-[8px] tracking-widest mb-2 border-b border-indigo-50 pb-1">Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {resume.skills.map((s) => s.name && (
                                <span key={s.id} className="text-slate-600 text-[8.5pt]">
                                  {s.name},
                                </span>
                              ))}
                            </div>
                          </section>
                        )}
                        {resume.education?.length > 0 && (
                          <section>
                            <p className="font-bold uppercase text-indigo-600 text-[8px] tracking-widest mb-2 border-b border-indigo-50 pb-1">Education</p>
                            {resume.education.map((edu) => (
                              <div key={edu.id} className="mb-3">
                                <p className="font-bold text-slate-800 text-[8.5pt] leading-tight">{edu.degree}</p>
                                <p className="text-slate-600 text-[8pt]">{edu.institution}</p>
                                <p className="text-indigo-400 text-[7.5pt] italic">{edu.startDate} — {edu.endDate}</p>
                              </div>
                            ))}
                          </section>
                        )}
                      </div>
                    </div>
                  </aside>

                  <div className="flex-1">
                    {resume.summary && (
                      <section className="mb-8">
                        <h2 className="text-[10pt] font-black uppercase text-indigo-900 border-b-2 border-indigo-50 mb-3 pb-1">Profile</h2>
                        <p className="text-[10pt] leading-relaxed text-slate-700 text-justify">{resume.summary}</p>
                      </section>
                    )}

                    {resume.experience?.length > 0 && (
                      <section className="mb-8">
                        <h2 className="text-[10pt] font-black uppercase text-indigo-900 border-b-2 border-indigo-50 mb-4">Experience</h2>
                        {resume.experience.map(exp => (
                          <div key={exp.id} className="mb-5">
                            <h3 className="font-bold text-slate-900 text-[10.5pt]">{exp.position}</h3>
                            <p className="text-indigo-700 text-[9pt] font-medium mb-1">
                              {exp.company} <span className="text-slate-300 mx-1">|</span> {exp.startDate} - {exp.endDate || 'Present'}
                            </p>
                            <ul className="list-disc ml-4 text-[9.5pt] text-slate-600 space-y-1">
                              {exp.responsibilities?.map((res, i) => res && <li key={i}>{res}</li>)}
                            </ul>
                          </div>
                        ))}
                      </section>
                    )}

                    {resume.projects && resume.projects.length > 0 && (
                      <section className="mb-8">
                        <h2 className="text-[10pt] font-black uppercase text-indigo-900 border-b-2 border-indigo-50 mb-4">Projects</h2>
                        {resume.projects.map(proj => (
                          <div key={proj.id} className="mb-4">
                            <h3 className="font-bold text-slate-900 text-[9.5pt]">{proj.name}</h3>
                            <p className="text-[9.5pt] text-slate-600 leading-relaxed">{proj.description}</p>
                          </div>
                        ))}
                      </section>
                    )}

                    {resume.certifications && resume.certifications.length > 0 && (
                      <section>
                        <h2 className="text-[10pt] font-black uppercase text-indigo-900 border-b-2 border-indigo-50 mb-4">Certifications</h2>
                        {resume.certifications.map(cert => (
                          <div key={cert.id} className="mb-2">
                            <p className="font-bold text-slate-900 text-[9.5pt]">{cert.name}</p>
                            <p className="text-slate-600 text-[9pt]">{cert.issuer}</p>
                          </div>
                        ))}
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