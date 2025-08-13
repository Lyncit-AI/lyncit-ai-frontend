import React, { useState } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { TrendingUp } from "lucide-react";
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");
  const [progressValue, setProgressValue] = useState(0);
  const [activeCampaigns] = useState([
    {
      id: 1,
      name: "Patient Care Technician (PCT)",
      type: "Hire",
      applicants: 25,
      newToday: 5
    },
    {
      id: 2,
      name: "Medical Assistant (MA)",
      type: "Rehire",
      applicants: 5,
      newToday: 0
    },
    {
      id: 3,
      name: "Registered Nurse (RN)",
      type: "Hire",
      applicants: 15,
      newToday: 0
    },
    {
      id: 4,
      name: "Home Health Aide (HHA)",
      type: "Rehire",
      applicants: 45,
      newToday: 0
    },
    {
      id: 5,
      name: "Patient Care Technician (PCT)",
      type: "Hire",
      applicants: 85,
      newToday: 0
    },
    {
      id: 6,
      name: "Care Coordinator",
      type: "Rehire",
      applicants: 2,
      newToday: 0
    }
  ]);

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
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                View All
              </button>
            </div>

            <div className="space-y-0">
              {activeCampaigns.map((campaign, index) => (
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
                      {campaign.newToday > 0 && (
                        <span className="text-green-600 ml-1">({campaign.newToday} New today)</span>
                      )}
                    </span>
                  </div>
                  
                  {/* Column 4: View Link */}
                  <div className="w-16 text-right">
                    <button className="text-[#7A5690] text-sm font-medium underline hover:no-underline">
                      View
                    </button>
                  </div>
                </div>
              ))}
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