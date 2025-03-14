import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";

const RecruiterDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { accessToken, userInfo } = location.state || {};
  
  const userName = userInfo?.name || "";
  const userEmail = userInfo?.email || "";
  const userPicture = userInfo?.picture || "";
  const userId = userInfo?.sub || "";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/"); // Assuming "/" is your login route
  };

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
            <p className="break-all text-sm mb-4">{accessToken}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-gray-500">No access token available</p>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;