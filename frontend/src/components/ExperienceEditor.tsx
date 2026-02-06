import { useResumeStore } from '../store/useResumeStore';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';

export const ExperienceEditor = () => {
  const { resume, addItem, updateItem, removeItem, optimizeContent, isLoading } = useResumeStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <h2 className="text-[11px] font-black tracking-[0.2em] text-emerald-400 uppercase flex items-center gap-2">
          Work Experience
        </h2>
        <button
          onClick={() => addItem('experience')}
          className="styled-add-btn"
        >
          <Plus size={14} /> ADD EXPERIENCE
        </button>
      </div>

      {resume.experience.map((exp) => (
        <div key={exp.id} className="glass-card p-5 relative group">
          <button
            onClick={() => removeItem('experience', exp.id)}
            className="delete-btn"
          >
            <Trash2 size={16} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              value={exp.company}
              placeholder="Company Name"
              className="neon-input font-bold"
              onChange={(e) => updateItem('experience', exp.id, { company: e.target.value })}
            />
            <input
              value={exp.position}
              placeholder="Role / Title"
              className="neon-input"
              onChange={(e) => updateItem('experience', exp.id, { position: e.target.value })}
            />
          </div>

          <div className="relative">
            <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block">Responsibilities</label>
            <textarea
              value={exp.responsibilities.join('\n')}
              placeholder="Describe your impact (one point per line)..."
              className="w-full bg-slate-900/40 p-3 rounded-xl border border-slate-800 text-sm min-h-30 focus:border-emerald-500 outline-none pr-12"
              onChange={(e) =>
                updateItem('experience', exp.id, { responsibilities: e.target.value.split('\n') })
              }
            />
            <button
              onClick={() => optimizeContent((exp.responsibilities ?? []).join('\n'), 'experience', exp.id)}
              disabled={isLoading || !exp.responsibilities.length}
              className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-2 py-1.5 rounded-md hover:bg-indigo-500 hover:text-white transition disabled:opacity-50 font-bold uppercase"
            >
              {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              {isLoading ? 'Rewriting...' : 'AI Rewrite'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};