import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from "axios";

const AnalyticsDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [progressValue, setProgressValue] = useState(0);
  const [campaignData, setCampaignData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `https://lyncitapplications.xyz:8086/campaign/${campaignId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json"
            }
          }
        );
        
        // Map API response to our component data structure
        const apiData = response.data;
        console.log(response.data, "====response data")
        console.log("Keywords from API:", apiData.keywords, "Type:", typeof apiData.keywords)
        
        setCampaignData({
          id: apiData.id,
          name: apiData.name,
          effectiveness: 38, // Keep static for now as it's not in API
          candidatesApplied: apiData.stats?.responded || 0,
          candidatesInvited: apiData.stats?.applicants, // Keep static for now
          totalCandidates: apiData.stats?.applicants || 0,
          responded: apiData.stats?.responded || 0,
          completed: apiData.stats?.completed || 0,
          highPriority: apiData.stats?.high || 0,
          interviewScheduled: apiData.stats?.interview || 0,
          candidates: apiData.candidates || [], // Add candidates array from API
          keywords: apiData.keywords || null // Add keywords from API
        });
      } catch (error) {
        console.error("Failed to fetch campaign data:", error);
        // Fallback to default data if API fails
        setCampaignData({
          id: campaignId,
          name: "Campaign Not Found",
          effectiveness: 0,
          candidatesApplied: 0,
          candidatesInvited: 0,
          totalCandidates: 0,
          responded: 0,
          completed: 0,
          highPriority: 0,
          interviewScheduled: 0,
          candidates: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaignData();
    }
  }, [campaignId]);

  useEffect(() => {
    // Animate the progress bar on mount
    if (campaignData) {
      const timer = setTimeout(() => {
        setProgressValue(campaignData.effectiveness);
      }, 500);
      
      // Initialize filtered candidates with all candidates
      setFilteredCandidates(campaignData.candidates || []);
      
      return () => clearTimeout(timer);
    }
  }, [campaignData]);

  // Handle keyword filtering
  const handleKeywordFilter = (keyword) => {
    if (selectedKeywords.includes(keyword)) {
      // Remove keyword from filter
      const newSelectedKeywords = selectedKeywords.filter(k => k !== keyword);
      setSelectedKeywords(newSelectedKeywords);
      
      if (newSelectedKeywords.length === 0) {
        // No filters active, show all candidates
        setFilteredCandidates(campaignData.candidates || []);
      } else {
        // Filter by remaining keywords
        const filtered = campaignData.candidates?.filter(candidate => 
          newSelectedKeywords.some(selectedKeyword => 
            candidate.keywords?.includes(selectedKeyword) || 
            candidate.classification?.includes(selectedKeyword) ||
            candidate.status?.includes(selectedKeyword)
          )
        ) || [];
        setFilteredCandidates(filtered);
      }
    } else {
      // Add keyword to filter
      const newSelectedKeywords = [...selectedKeywords, keyword];
      setSelectedKeywords(newSelectedKeywords);
      
      // Filter candidates by selected keywords
      const filtered = campaignData.candidates?.filter(candidate => 
        newSelectedKeywords.some(selectedKeyword => 
          candidate.keywords?.includes(selectedKeyword) || 
          candidate.classification?.includes(selectedKeyword) ||
          candidate.status?.includes(selectedKeyword)
        )
      ) || [];
      setFilteredCandidates(filtered);
    }
  };

  // Handle keyword removal
  const handleKeywordRemove = (keyword) => {
    const newSelectedKeywords = selectedKeywords.filter(k => k !== keyword);
    setSelectedKeywords(newSelectedKeywords);
    
    if (newSelectedKeywords.length === 0) {
      // No filters active, show all candidates
      setFilteredCandidates(campaignData.candidates || []);
    } else {
      // Filter by remaining keywords
      const filtered = campaignData.candidates?.filter(candidate => 
        newSelectedKeywords.some(selectedKeyword => 
          candidate.keywords?.includes(selectedKeyword) || 
          candidate.classification?.includes(selectedKeyword) ||
          candidate.status?.includes(selectedKeyword)
        )
      ) || [];
      setFilteredCandidates(filtered);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="px-[32px] pb-10 max-sm:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate('/analytics')}
                className="flex items-center gap-2 text-[#637083] hover:text-[#7A5690] transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A5690]"></div>
            <span className="ml-4 text-gray-500">Loading campaign details...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!campaignData) {
    return (
      <DashboardLayout>
        <div className="px-[32px] pb-10 max-sm:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate('/analytics')}
                className="flex items-center gap-2 text-[#637083] hover:text-[#7A5690] transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
            </div>
          </div>
          <div className="text-center py-20 text-gray-500">
            Campaign not found or failed to load.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-[32px] pb-10 max-sm:px-8">
        {/* Header with Back Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2 text-[#637083] hover:text-[#7A5690] transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[16px] p-8 border border-[#EAEAEA]">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Section - Effectiveness and Campaign Info */}
            <div className="flex items-start gap-6">
              {/* Effectiveness Circular Progress Bar */}
              <div className="w-48 h-48 flex-shrink-0">
                <CircularProgressbarWithChildren
                  value={progressValue}
                  styles={buildStyles({
                    pathColor: '#ef4444', // red color
                    trailColor: '#f3f4f6',
                    strokeLinecap: 'round',
                    strokeWidth: 8,
                  })}
                >
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Effectiveness</div>
                    <div className="text-3xl font-bold text-red-500">{progressValue}%</div>
                  </div>
                </CircularProgressbarWithChildren>
              </div>

              {/* Campaign Title and Candidate Count */}
              <div className="flex flex-col justify-start pt-4">
                <h1 className="font-inter font-semibold text-2xl leading-8 text-gray-900 mb-4">
                  {campaignData.name}
                </h1>
                
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{campaignData.candidatesApplied}</span>
                    <span className="text-sm text-gray-500">Candidates applied/</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {campaignData.candidatesInvited} Candidates Invited
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Candidate Funnel/Workflow */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-center space-x-4">
                {/* Total Candidates */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-2">Total Candidates</span>
                  <div className="w-16 h-8 bg-purple-500 rounded-l-lg flex items-center justify-center">
                    <div className="w-0 h-0 border-l-8 border-l-purple-500 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-2"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 mt-2">{campaignData.totalCandidates}</span>
                </div>

                {/* Responded */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-2">Responded</span>
                  <div className="w-16 h-8 bg-green-500 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-8 border-l-green-500 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-2"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 mt-2">{campaignData.responded}</span>
                </div>

                {/* Completed */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-2">Completed</span>
                  <div className="w-16 h-8 bg-gray-300 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-8 border-l-gray-300 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-2"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 mt-2">{campaignData.completed}</span>
                </div>

                {/* High Priority */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-2">High Priority</span>
                  <div className="w-16 h-8 bg-gray-600 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-8 border-l-gray-600 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-2"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 mt-2">{campaignData.highPriority}</span>
                </div>

                {/* Interview Scheduled */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-2">Interview Scheduled</span>
                  <div className="w-16 h-8 bg-blue-400 rounded-r-lg flex items-center justify-center">
                    <div className="w-0 h-0 border-l-8 border-l-blue-400 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-2"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 mt-2">{campaignData.interviewScheduled}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info */}


        {/* Selected Keywords Section */}
        {campaignData.keywords && (
          <div className="mt-8 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Keywords:</h2>
            <div className="flex flex-wrap gap-2">
              {campaignData.keywords.split(', ').map((keyword, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                    selectedKeywords.includes(keyword) 
                      ? 'bg-[#5A3A70] text-white ring-2 ring-[#7A5690]' 
                      : 'bg-[#7A5690] text-white hover:bg-[#6A4A80]'
                  }`}
                  onClick={() => handleKeywordFilter(keyword)}
                  title={`Filter by: ${keyword}`}
                >
                  <span>{keyword}</span>
                  <button 
                    className="text-white hover:text-gray-200 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleKeywordRemove(keyword);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {/* {campaignData.keywords && (
              <p className="text-sm text-gray-500 mt-2">
                Click on keywords to filter candidates. These keywords were selected during campaign creation.
                {selectedKeywords.length > 0 && (
                  <span className="ml-2 text-[#7A5690] font-medium">
                    Active filters: {selectedKeywords.join(', ')}
                  </span>
                )}
              </p>
            )} */}
          </div>
        )}

        {/* Data Table Section */}
        <div className="bg-white rounded-[16px] mt-8 border border-[#EAEAEA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Classification</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Scheduled Meeting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCandidates && filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate, index) => {
                    const firstName = candidate.candidate?.firstName || '';
                    const lastName = candidate.candidate?.lastName || '';
                    const fullName = `${firstName} ${lastName}`.trim();
                    const initial = fullName.charAt(0).toUpperCase();
                    const classification = candidate.class === 'high' ? 'High Priority' : 
                                        candidate.class === 'low' ? 'Low Priority' : 'Medium Priority';
                    const classificationColor = candidate.class === 'high' ? 'bg-red-100 text-red-800' :
                                             candidate.class === 'low' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800';
                    
                    return (
                      <tr key={candidate.candidateID} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{String(index + 1).padStart(2, '0')}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">{initial}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{fullName || 'N/A'}</div>
                              <div className="text-sm text-gray-500">Candidate ID: {candidate.candidateID.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {candidate.status === 'new' ? 'Active' : candidate.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{candidate.score || 0}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classificationColor}`}>
                            {classification}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {candidate.interviewDttm ? (
                            <span className="text-sm text-gray-900">
                              {new Date(candidate.interviewDttm).toLocaleDateString()} ({new Date(candidate.interviewDttm).toLocaleTimeString()})
                            </span>
                          ) : (
                            <button className="inline-flex items-center gap-2 px-3 py-1 border border-green-300 text-green-700 rounded-lg text-sm hover:bg-green-50">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              Send Reminder
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      {selectedKeywords.length > 0 
                        ? `No candidates match the selected keywords: ${selectedKeywords.join(', ')}`
                        : 'No candidates found for this campaign.'
                      }
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
};

export default AnalyticsDetail; 