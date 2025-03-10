import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";

const RecruiterDashboard = () => {
  const location = useLocation();
  
  // Get the state passed from navigation
  const { accessToken, userInfo } = location.state || {};

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <Sidebar name={userInfo.name} picture={userInfo.picture} />
      <div className="flex-1 w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Recruiter Dashboard</h1>
        
        {/* Display User Info */}
        {userInfo ? (
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-lg font-semibold mb-2">User Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">ID:</span> {userInfo.sub}</p>
              <p><span className="font-medium">Name:</span> {userInfo.name}</p>
              <p><span className="font-medium">Given Name:</span> {userInfo.given_name}</p>
              <p><span className="font-medium">Email:</span> {userInfo.email}</p>
              <p><span className="font-medium">Email Verified:</span> {userInfo.email_verified ? 'Yes' : 'No'}</p>
              {userInfo.picture && (
                <div>
                  <span className="font-medium">Profile Picture:</span>
                  <img 
                    src={userInfo.picture} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full mt-2" 
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No user information available</p>
        )}

        {/* Display Access Token */}
        {accessToken ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Access Token</h2>
            <p className="break-all text-sm">{accessToken}</p>
          </div>
        ) : (
          <p className="text-gray-500">No access token available</p>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;