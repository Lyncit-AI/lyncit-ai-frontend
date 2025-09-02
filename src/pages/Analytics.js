import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from "axios";

const Analytics = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");
  const [progressValue, setProgressValue] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://lyncitapplications.xyz:8086/campaign/?skip=0&limit=200",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json"
            }
          }
        );
        
        // Map API response
        console.log(response.data ,"=response")
        const apiCampaigns = response.data
          .slice() // make a shallow copy
          .reverse() // reverse the order
          .map((item) => ({
            id: item.id,
            name: item.name,
            type: "Hire", // All campaigns are "Hire" type
            applicants: Array.isArray(item.candidates) ? item.candidates.length : 0,
            newToday: Math.floor(Math.random() * 5) // Random number for demo purposes
          }));
        
        setAllCampaigns(apiCampaigns);
        setActiveCampaigns(apiCampaigns.slice(0, 6)); // Only show last 6 by default
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
        // Fallback to empty array if API fails
        setActiveCampaigns([]);
        setAllCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);

  React.useEffect(() => {
    // Animate the progress bar on mount
    const timer = setTimeout(() => {
      setProgressValue(38);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getButtonStyle = (type) => {
    return type === "Hire" 
      ? "bg-[#7A5690] text-white hover:bg-[#6A4A80]" 
      : "bg-[#3d3d4e] text-white hover:bg-[#2d2d3e]";
  };

  const handleViewAll = () => {
    setShowAllCampaigns(true);
  };

  const handleBackToAnalytics = () => {
    setShowAllCampaigns(false);
  };

  // If showing all campaigns, render the table view
  if (showAllCampaigns) {
    return (
      <DashboardLayout>
        <div className="px-[32px] pb-10 max-sm:px-8">
          <div className="mb-8">
            <button
              onClick={handleBackToAnalytics}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black mb-4"
            >
              <ArrowLeft size={16} />
              Back to Analytics
            </button>
            <h1 className="font-inter font-semibold text-lg leading-7 text-[#637083]">All Campaigns</h1>
          </div>

          <div className="bg-white rounded-[16px] border border-[#EAEAEA] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-[#EAEAEA] bg-gray-50">
                  <tr>
                    <th className="p-6 text-left font-medium text-gray-900">Campaign Name</th>
                    <th className="p-6 text-left font-medium text-gray-900">Type</th>
                    <th className="p-6 text-left font-medium text-gray-900">Applicants</th>
                    <th className="p-6 text-left font-medium text-gray-900">New Today</th>
                    <th className="p-6 text-left font-medium text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7A5690]"></div>
                          <span className="ml-3 text-gray-500">Loading campaigns...</span>
                        </div>
                      </td>
                    </tr>
                  ) : allCampaigns.length > 0 ? (
                    allCampaigns.map((campaign, index) => (
                      <tr key={campaign.id} className={`${index !== allCampaigns.length - 1 ? 'border-b border-[#EAEAEA]' : ''}`}>
                        <td className="p-6">
                          <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                        </td>
                        <td className="p-6">
                          <button className={`px-4 py-2 rounded-lg text-sm font-medium ${getButtonStyle(campaign.type)}`}>
                            {campaign.type}
                          </button>
                        </td>
                        <td className="p-6">
                          <span className="text-sm text-[#637083]">
                            {campaign.applicants} Applicants
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="text-sm text-[#637083]">
                            {campaign.newToday > 0 ? (
                              <span className="text-green-600">{campaign.newToday} New today</span>
                            ) : (
                              "0 New today"
                            )}
                          </span>
                        </td>
                        <td className="p-6">
                          <button 
                            onClick={() => navigate(`/analytics/${campaign.id}`)}
                            className="text-[#7A5690] text-sm font-medium underline hover:no-underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-400">
                        No campaigns found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Default analytics view with last 6 campaigns
  return (
    <DashboardLayout>
      <div className="px-[32px] pb-10 max-sm:px-8">
        <div className="mb-8">
          <h1 className="font-inter font-semibold text-lg leading-7 text-[#637083]">Campaign details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Section: Active Campaigns */}
          <div className="lg:col-span-3 bg-white rounded-[16px] p-6 border border-[#EAEAEA]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Campaigns</h2>
              <button 
                onClick={handleViewAll}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View All
              </button>
            </div>

            <div className="space-y-0">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7A5690]"></div>
                  <span className="ml-3 text-gray-500">Loading campaigns...</span>
                </div>
              ) : activeCampaigns.length > 0 ? (
                activeCampaigns.map((campaign, index) => (
                  <div key={campaign.id} className={`flex items-center justify-between py-4 ${index !== activeCampaigns.length - 1 ? 'border-b border-[#EAEAEA]' : ''}`}>
                    {/* Column 1: Campaign Name */}
                    <div className="w-48">
                      <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                    </div>
                    
                    {/* Column 2: Hire/Rehire Button */}
                    <div className="w-24 flex justify-center mr-4">
                      <button className={`w-20 px-4 py-2 rounded-lg text-sm font-medium ${getButtonStyle(campaign.type)}`}>
                        {campaign.type}
                      </button>
                    </div>
                    
                    {/* Column 3: Applicant Count */}
                    <div className="w-32 text-right">
                      <span className="text-sm text-[#637083] whitespace-nowrap">
                        {campaign.applicants} Applicants
                        {/* {campaign.newToday > 0 && (
                          <span className="text-green-600 ml-1">({campaign.newToday} New today)</span>
                        )} */}
                      </span>
                    </div>
                    
                    {/* Column 4: View Link */}
                    <div className="w-16 text-right">
                      <button 
                        onClick={() => navigate(`/analytics/${campaign.id}`)}
                        className="text-[#7A5690] text-sm font-medium underline hover:no-underline"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No campaigns found.
                </div>
              )}
            </div>
          </div>

          {/* Right Section: Campaign Responsiveness */}
          <div className="lg:col-span-2 bg-white rounded-[16px] p-6 border border-[#EAEAEA]">
            <div className="flex justify-start mb-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-[#EAEAEA] rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A5690]"
              >
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Campaign Responsiveness</h2>
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <TrendingUp size={12} className="text-gray-600" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Circular Progress Chart */}
              <div className="w-40 h-40">
                <CircularProgressbarWithChildren
                  value={progressValue}
                  styles={buildStyles({
                    pathColor: '#ef4444', // red color
                    trailColor: '#e5e7eb',
                    strokeLinecap: 'round',
                  })}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{progressValue}%</div>
                  </div>
                </CircularProgressbarWithChildren>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button className="px-4 py-2 bg-[#7A5690] text-white rounded-lg text-sm font-medium hover:bg-[#6A4A80]">
                  Hire
                </button>
                <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400">
                  Rehire
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300">
                  Sync
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-red-500 text-sm font-medium">27% down from previous Month</p>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-[#637083]">
                Analyze the insights to optimize future strategies and improve performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics; 