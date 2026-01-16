import { useResumeStore } from '../store/useResumeStore';
import { 
  User, Mail, Phone, MapPin, Github, Linkedin, 
  Briefcase, GraduationCap, Folder, Zap, Sparkles, Plus, Trash2, Loader2 
} from 'lucide-react';

const Editor = () => {
  const { 
    resume, updatePersonalInfo, updateSummary, addItem, updateItem, 
    removeItem, updateSkills, optimizeContent, isLoading 
  } = useResumeStore();

  return (
    <div className="space-y-10 pb-20">
      
      {/* 1. PERSONAL DETAILS - Same as before */}
      <section className="glass-card p-6 border-l-4 border-l-emerald-500">
        <h2 className="text-[11px] font-black tracking-[0.2em] mb-6 flex items-center gap-2 text-emerald-400 uppercase">
          <User size={14} /> Identity & Contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Full Name</label>
            <input placeholder="John Doe" value={resume.personalInfo.fullName} onChange={(e) => updatePersonalInfo({fullName: e.target.value})} className="neon-input" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Email</label>
            <input placeholder="email@example.com" value={resume.personalInfo.email} onChange={(e) => updatePersonalInfo({email: e.target.value})} className="neon-input" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Phone</label>
            <input placeholder="+91 90150XXXXX" value={resume.personalInfo.phone} onChange={(e) => updatePersonalInfo({phone: e.target.value})} className="neon-input" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Location</label>
            <input placeholder="City, Country" value={resume.personalInfo.city} onChange={(e) => updatePersonalInfo({city: e.target.value})} className="neon-input" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-1"><Linkedin size={10}/> LinkedIn URL</label>
            <input placeholder="linkedin.com/in/username" value={resume.personalInfo.linkedin} onChange={(e) => updatePersonalInfo({linkedin: e.target.value})} className="neon-input" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-1"><Github size={10}/> Github URL</label>
            <input placeholder="github.com/username" value={resume.personalInfo.github} onChange={(e) => updatePersonalInfo({github: e.target.value})} className="neon-input" />
          </div>
        </div>
      </section>

      {/* PROFESSIONAL SUMMARY - Connected with type 'summary' */}
      <section className="glass-card p-6 border-l-4 border-l-emerald-500">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400" />
            <h2 className="text-[11px] font-black tracking-[0.2em] text-emerald-400 uppercase">
              Professional Summary
            </h2>
          </div>
          <button 
            onClick={() => optimizeContent(resume.summary, 'summary')}
            disabled={isLoading || !resume.summary}
            className="flex items-center gap-2 text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-30 uppercase disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
            AI Optimize
          </button>
        </div>
        <div className="space-y-2">
          <textarea 
            placeholder="e.g. Final-year Computer Science student..." 
            className="w-full bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-sm text-slate-300 outline-none min-h-[120px] focus:border-emerald-500/50 transition-all" 
            value={resume.summary} 
            onChange={(e) => updateSummary(e.target.value)} 
          />
          <p className="text-[9px] text-slate-500 italic ml-1 font-medium">Tip: Aapke PDF layout ke hisaab se 2-4 lines best dikhengi.</p>
        </div>
      </section>
          
      {/* EDUCATION - Exactly same as yours */}
      <section className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[11px] font-black tracking-[0.2em] flex items-center gap-2 text-emerald-400 uppercase">
            <GraduationCap size={14} /> Education
          </h2>
          <button onClick={() => addItem('education')} className="text-emerald-500 text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-500/10 px-2 py-1 rounded transition-colors"><Plus size={14}/> ADD</button>
        </div>
        {resume.education.map((edu) => (
          <div key={edu.id} className="p-4 border border-slate-800 rounded-xl bg-slate-950/20 mb-4 space-y-3 relative group">
            <button onClick={() => removeItem('education', edu.id)} className="absolute top-2 right-2 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
            <input placeholder="University/School" className="neon-input font-bold" value={edu.school} onChange={(e) => updateItem('education', edu.id, {school: e.target.value})} />
            <input placeholder="Degree" className="neon-input text-sm" value={edu.degree} onChange={(e) => updateItem('education', edu.id, {degree: e.target.value})} />
            <div className="grid grid-cols-3 gap-3">
              <select className="neon-input text-[10px] bg-slate-900 cursor-pointer" value={edu.scoreType || "CGPA"} onChange={(e) => updateItem('education', edu.id, {scoreType: e.target.value})}>
                <option value="CGPA">CGPA</option>
                <option value="Percentage">Percentage</option>
              </select>
              <input placeholder="Score" className="neon-input text-sm col-span-1" value={edu.score} onChange={(e) => updateItem('education', edu.id, {score: e.target.value})} />
              <input placeholder="Year" className="neon-input text-sm" value={edu.year} onChange={(e) => updateItem('education', edu.id, {year: e.target.value})} />
            </div>
          </div>
        ))}
      </section>

      {/* EXPERIENCE - Connected with type 'experience' and id */}
      <section className="glass-card p-6 border-l-4 border-l-emerald-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[11px] font-black tracking-[0.2em] flex items-center gap-2 text-emerald-400 uppercase">
            <Briefcase size={14} /> Experience & Internships
          </h2>
          <button onClick={() => addItem('experience')} className="text-emerald-500 text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-500/10 px-2 py-1 rounded"><Plus size={14}/> ADD EXPERIENCE</button>
        </div>
        {resume.experience.map((exp) => (
          <div key={exp.id} className="p-5 border border-slate-800 rounded-2xl bg-slate-950/40 mb-6 relative group transition-all hover:border-emerald-500/30">
            <button onClick={() => removeItem('experience', exp.id)} className="absolute top-3 right-3 text-slate-700 hover:text-red-500 transition-opacity"><Trash2 size={16}/></button>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Company" className="neon-input" value={exp.company} onChange={(e) => updateItem('experience', exp.id, {company: e.target.value})} />
                <input placeholder="Role" className="neon-input" value={exp.role} onChange={(e) => updateItem('experience', exp.id, {role: e.target.value})} />
              </div>
              <input placeholder="Duration" className="neon-input" value={exp.duration} onChange={(e) => updateItem('experience', exp.id, {duration: e.target.value})} />
              <div className="space-y-2">
                <textarea 
                  placeholder="Describe your work..." 
                  className="w-full bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-sm text-slate-300 outline-none min-h-[100px] focus:border-emerald-500/50" 
                  value={exp.desc} 
                  onChange={(e) => updateItem('experience', exp.id, {desc: e.target.value})} 
                />
                <button 
                  onClick={() => optimizeContent(exp.desc, 'experience', exp.id)} 
                  disabled={isLoading || !exp.desc}
                  className="flex items-center gap-2 text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all uppercase disabled:opacity-30"
                >
                  {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI Optimize Experience
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* PROJECTS - Exactly same as yours */}
      <section className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[11px] font-black tracking-[0.2em] flex items-center gap-2 text-emerald-400 uppercase">
            <Folder size={14} /> Projects
          </h2>
          <button onClick={() => addItem('projects')} className="text-emerald-500 text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-500/10 px-2 py-1 rounded transition-colors"><Plus size={14}/> ADD</button>
        </div>
        {resume.projects.map((proj) => (
          <div key={proj.id} className="p-4 border border-slate-800 rounded-xl bg-slate-950/20 mb-4 space-y-3 relative group">
            <button onClick={() => removeItem('projects', proj.id)} className="absolute top-2 right-2 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
            <input placeholder="Project Name" className="neon-input font-bold" value={proj.name} onChange={(e) => updateItem('projects', proj.id, {name: e.target.value})} />
            <input placeholder="Github/Live Link" className="neon-input text-[10px] text-blue-400" value={proj.link} onChange={(e) => updateItem('projects', proj.id, {link: e.target.value})} />
            <textarea placeholder="Project description..." className="w-full bg-slate-900/40 p-2 rounded-lg border border-slate-800 text-xs text-slate-400 outline-none min-h-[60px]" value={proj.desc} onChange={(e) => updateItem('projects', proj.id, {desc: e.target.value})} />
          </div>
        ))}
      </section>

      {/* SKILLS - Exactly same as yours */}
      <section className="glass-card p-6 border-l-4 border-l-emerald-500">
        <h2 className="text-[11px] font-black tracking-[0.2em] mb-6 flex items-center gap-2 text-emerald-400 uppercase">
          <Zap size={14} /> Skills & Technologies
        </h2>
        <div className="space-y-4">
          <input 
            placeholder="e.g. React, Node.js, Python" 
            className="neon-input"
            value={resume.skills.join(', ')}
            onChange={(e) => updateSkills(e.target.value.split(',').map(s => s.trim()))}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {resume.skills.length > 0 && resume.skills[0] !== "" ? (
              resume.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-emerald-500/10">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                  {skill}
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-600 italic">No skills added yet...</p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Editor;