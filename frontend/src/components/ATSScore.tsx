import React, { useState } from 'react';
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
        jobDescription: jd,
      });
      setResult(res.data);
    } catch (err) {
      alert('Error analyzing resume!');
    }
    setLoading(false);
  };

  return <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full max-w-2xl"></div>;
};
