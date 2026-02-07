import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { User, GraduationCap, Folder, Sparkles, Plus, Award, Code, Trash2, Loader2 } from 'lucide-react';
import { ExperienceEditor } from './ExperienceEditor';

const Editor: React.FC = () => {
  const { resume, updatePersonalInfo, updateSummary, addItem, removeItem, updateItem, optimizeContent, isLoading } = useResumeStore();

  return (
    <div className="space-y-10 pb-20">
      {/* 1. PERSONAL INFO */}
      <section className="glass-card p-6 border-l-4 border-l-emerald-500">
        <h2 className="text-[11px] font-black tracking-[0.2em] mb-6 flex items-center gap-2 text-emerald-400 uppercase">
          <User size={14} /> Identity & Contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input placeholder="Full Name" className="neon-input" value={resume.personalInfo.name} onChange={e => updatePersonalInfo({ name: e.target.value })} />
          <input placeholder="Email" className="neon-input" value={resume.personalInfo.email} onChange={e => updatePersonalInfo({ email: e.target.value })} />
          <input placeholder="Phone" className="neon-input" value={resume.personalInfo.phone} onChange={e => updatePersonalInfo({ phone: e.target.value })} />
          <input placeholder="Location" className="neon-input" value={resume.personalInfo.location || ''} onChange={e => updatePersonalInfo({ location: e.target.value })} />
        </div>
      </section>

      {/* 2. PROFESSIONAL SUMMARY */}
      <section className="glass-card p-6 border-l-4 border-l-emerald-500">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[11px] font-black tracking-[0.2em] text-emerald-400 uppercase flex items-center gap-2">
            <Sparkles size={14} /> Professional Summary
          </h2>
          <button
           onClick={() => optimizeContent(resume.summary ?? '', 'summary')}
            disabled={isLoading || !resume.summary || resume.summary.length < 10}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {isLoading ? 'OPTIMIZING...' : 'AI OPTIMIZE'}
          </button>
        </div>
        <textarea
          className="w-full bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-sm min-h-30 focus:border-emerald-500 outline-none transition-all"
          placeholder="Briefly describe your career goals..."
          value={resume.summary || ''}
          onChange={e => updateSummary(e.target.value)}
        />
      </section>

      <ExperienceEditor />

      {/* 4. EDUCATION */}
      <section className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[11px] font-black tracking-[0.2em] flex items-center gap-2 text-emerald-400 uppercase">
            <GraduationCap size={14} /> Education
          </h2>
          <button onClick={() => addItem('education')} className="styled-add-btn">
            <Plus size={14}/> ADD EDUCATION
          </button>
        </div>
        {resume.education.map(edu => (
          <div key={edu.id} className="p-4 border border-slate-800 rounded-xl mb-4 relative group bg-slate-900/20">
            <button onClick={() => removeItem('education', edu.id)} className="delete-btn"><Trash2 size={14}/></button>
            <input placeholder="Institution" className="neon-input font-bold mb-2" value={edu.institution} onChange={e => updateItem('education', edu.id, { institution: e.target.value })} />
            <input placeholder="Degree" className="neon-input mb-2" value={edu.degree} onChange={e => updateItem('education', edu.id, { degree: e.target.value })} />
            <div className="grid grid-cols-2 gap-3 mt-2">
              <input placeholder="Start Date" className="neon-input text-xs" value={edu.startDate} onChange={e => updateItem('education', edu.id, { startDate: e.target.value })} />
              <input placeholder="End Date" className="neon-input text-xs" value={edu.endDate} onChange={e => updateItem('education', edu.id, { endDate: e.target.value })} />
            </div>
          </div>
        ))}
      </section>

      {/* 5. PROJECTS */}
      <section className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[11px] font-black tracking-[0.2em] flex items-center gap-2 text-emerald-400 uppercase">
            <Folder size={14} /> Projects
          </h2>
          <button onClick={() => addItem('projects')} className="styled-add-btn">
            <Plus size={14}/> ADD PROJECT
          </button>
        </div>
        {resume.projects?.map(proj => (
          <div key={proj.id} className="p-4 border border-slate-800 rounded-xl mb-4 relative group bg-slate-900/20">
            <button onClick={() => removeItem('projects', proj.id)} className="delete-btn"><Trash2 size={14}/></button>
            <input placeholder="Project Name" className="neon-input font-bold mb-2" value={proj.name} onChange={e => updateItem('projects', proj.id, { name: e.target.value })} />
            <textarea placeholder="Description..." className="w-full bg-slate-900/40 p-3 rounded-lg text-sm mt-2 border border-slate-800" value={proj.description} onChange={e => updateItem('projects', proj.id, { description: e.target.value })} />
          </div>
        ))}
      </section>

      {/* 6. SKILLS */}
      <section className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[11px] font-black tracking-[0.2em] flex items-center gap-2 text-emerald-400 uppercase">
            <Code size={14} /> Skills
          </h2>
          <button onClick={() => addItem('skills')} className="styled-add-btn">
            <Plus size={14}/> ADD SKILL
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {resume.skills.map((skill) => (
            <div key={skill.id} className="relative group">
              <input 
                placeholder="Skill (e.g., React)" 
                className="neon-input pr-10" 
                value={skill.name} 
                onChange={e => updateItem('skills', skill.id, { name: e.target.value })} 
              />
              <button 
                onClick={() => removeItem('skills', skill.id)} 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14}/>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CERTIFICATIONS */}
      <section className="glass-card p-6 border-l-4 border-l-emerald-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[11px] font-black tracking-[0.2em] flex items-center gap-2 text-emerald-400 uppercase">
            <Award size={14} /> Certifications
          </h2>
          <button onClick={() => addItem('certifications')} className="styled-add-btn">
            <Plus size={14}/> ADD CERT
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resume.certifications?.map(cert => (
            <div key={cert.id} className="p-4 border border-slate-800 rounded-xl relative group bg-slate-900/20">
              <button onClick={() => removeItem('certifications', cert.id)} className="delete-btn"><Trash2 size={14}/></button>
              <input placeholder="Certification Name" className="neon-input text-sm font-bold" value={cert.name} onChange={e => updateItem('certifications', cert.id, { name: e.target.value })} />
              <input placeholder="Issuer" className="neon-input text-xs mt-2" value={cert.issuer} onChange={e => updateItem('certifications', cert.id, { issuer: e.target.value })} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Editor;