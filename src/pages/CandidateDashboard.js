import React from 'react';

const CandidateDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-green-600 text-white p-6">
        <h2 className="text-3xl font-bold">Candidate Dashboard</h2>
      </div>
      <div className="p-6">
        <div className="flex space-x-6">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/4">
            <h3 className="text-xl font-semibold">Job Applications</h3>
            <p className="mt-4">Track your job applications and their status.</p>
            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md">
              View Applications
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md w-1/4">
            <h3 className="text-xl font-semibold">Profile</h3>
            <p className="mt-4">Update your resume and personal details.</p>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
