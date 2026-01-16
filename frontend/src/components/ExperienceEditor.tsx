import { useResumeStore } from '../store/useResumeStore';
import { PlusCircle, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { rewriteExperience } from '../services/api';
import { useState } from 'react';

export const ExperienceEditor = () => {
  const { resume, addItem, updateItem, removeItem } = useResumeStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRewrite = async (id: string, currentText: string) => {
    if (!currentText) return;

    setLoadingId(id); // Loading start
    const optimizedText = await rewriteExperience(currentText);

    if (optimizedText) {
      updateItem('experience', id, { desc: optimizedText });
    }
    setLoadingId(null); // Loading stop
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-xl font-bold text-gray-700">Work Experience</h2>
        <button
          onClick={() => addItem('experience')}
          className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition"
        >
          <PlusCircle size={16} /> Add Job
        </button>
      </div>

      {resume.experience.map((exp) => (
        <div key={exp.id} className="p-4 border rounded-lg bg-gray-50 relative group shadow-sm">
          <button
             onClick={() => removeItem('experience', exp.id)}
             className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              value={exp.company}
              placeholder="Company Name"
              className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => updateItem('experience', exp.id, { company: e.target.value })}
            />
            <input
              value={exp.role}
              placeholder="Role / Title"
              className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => updateItem('experience', exp.id, { role: e.target.value })}
            />
          </div>

          <div className="relative mt-4">
            <textarea
              value={exp.desc}
              placeholder="Describe your impact..."
              className="w-full p-2 border rounded min-h-[100px] focus:ring-2 focus:ring-blue-400 outline-none pr-20"
              onChange={(e) => updateItem('experience', exp.id, { desc: e.target.value })}
            />
            
            {/* AI Magic Button */}
            <button
              onClick={() => handleRewrite(exp.id, exp.desc)}
              disabled={loadingId === exp.id}
              className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md hover:bg-indigo-200 transition disabled:opacity-50 font-bold uppercase tracking-wider"
            >
              {loadingId === exp.id ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Sparkles size={12} />
              )}
              {loadingId === exp.id ? 'Rewriting...' : 'AI Rewrite'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};