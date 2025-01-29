import React from "react";
import Sidebar from "../components/ui/Sidebar";

const RecruiterDashboard = () => {
  return (
    <div className="flex h-screen w-full bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-0">
        <div className="bg-blue-600 text-white p-6">
          <h2 className="text-3xl font-bold">Recruiter Dashboard</h2>
        </div>
        <div className="p-6">
          {/* <div className="flex space-x-6">
            <div className="bg-white p-6 rounded-lg shadow-md w-1/4">
              <h3 className="text-xl font-semibold">Job Postings</h3>
              <p className="mt-4">View and manage your job listings.</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">
                View Job Postings
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md w-1/4">
              <h3 className="text-xl font-semibold">Candidates</h3>
              <p className="mt-4">Review and manage applications from candidates.</p>
              <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md">
                View Candidates
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
