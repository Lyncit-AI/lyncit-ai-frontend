import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";

const RecruiterDashboard = () => {
  const location = useLocation();
  
  const { accessToken, userInfo } = location.state || {};
  
  const userName = userInfo?.name || "";
  const userEmail = userInfo?.email || "";
  const userPicture = userInfo?.picture || "";
  const userId = userInfo?.sub || "";

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <Sidebar name={userName} picture={userPicture} />
      <div className="flex-1 w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Recruiter Dashboard</h1>
        
        {userInfo ? (
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-lg font-semibold mb-2">User Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">ID:</span> {userId}</p>
              <p><span className="font-medium">Name:</span> {userName}</p>
              <p><span className="font-medium">Email:</span> {userEmail}</p>
              {userPicture && (
                <div>
                  <span className="font-medium">Profile Picture:</span>
                  <img 
                    src={userPicture} 
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