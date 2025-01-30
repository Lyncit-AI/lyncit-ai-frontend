import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CandidateQuestionnaire() {
  const { campaignId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    // Fetch the campaign details (questions) from backend
    setQuestions([
      { id: 1, text: 'Tell us about yourself' },
      { id: 2, text: 'Why do you want this role?' }
    ]);
  }, [campaignId]);

  const handleChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSubmit = () => {
    alert('Thank you! Your responses have been submitted.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-secondary mb-6">Candidate Questionnaire</h2>
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="flex flex-col">
              <label className="text-secondary font-medium mb-2">{q.text}</label>
              <textarea
                className="border border-muted rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows="4"
                value={responses[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-primary text-white py-3 rounded-lg text-lg font-medium hover:bg-opacity-90 transition duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default CandidateQuestionnaire;
