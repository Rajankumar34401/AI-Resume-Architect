import { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import axios from 'axios';

export const ATSScore = () => {
  const { resume } = useResumeStore();
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeATS = async () => {
    setLoading(true);
    try {
      // Backend URL (live karne par ye change hoga)
      const res = await axios.post('http://localhost:5000/api/ats-score', {
        resumeData: resume,
        jobDescription: jd
      });
      setResult(res.data);
    } catch (err) {
      alert("Error analyzing resume!");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full max-w-2xl">
      <h3 className="text-xl font-bold mb-4">ATS Optimizer</h3>
      <textarea 
        className="w-full p-3 border rounded-lg h-32 mb-4 text-sm"
        placeholder="Paste Job Description here..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />
      <button 
        onClick={analyzeATS}
        disabled={loading || !jd}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {loading ? "Analyzing..." : "Calculate ATS Score"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-3xl font-bold text-indigo-600">{result.score}%</span>
            <span className="text-gray-600 font-medium text-sm">Match Score</span>
          </div>
          <p className="text-sm mb-3"><strong>Feedback:</strong> {result.feedback}</p>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords.map((k: string) => (
              <span key={k} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                Missing: {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};