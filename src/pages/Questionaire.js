import { QuestionNode } from "../components/recruiter/QuestionNode";
import React, { useState, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Sidebar } from "../components/recruiter/Sidebar";
import { useNavigate } from "react-router-dom";
import { QuestionFlow } from "../components/recruiter/QuestionFlow";
import { ArrowLeft } from "lucide-react";
import Logo from "../assets/icons/keylogo";
import ReactFlow, { useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

const nodeTypes = {
  questionNode: QuestionNode,
};

const edgeOptions = {
  style: { 
    strokeDasharray: '5,5', 
    stroke: '#A273C0',
    strokeWidth: 2
  },
  type: 'smoothstep',
  animated: true,
};


const customStyles = `
  .react-flow__edge-path {
    stroke: #A273C0 !important;
    stroke-width: 2 !important;
  }
`;

function sanitizeQuestionnaire(flow) {
  return {
    nodes: flow.nodes.map(node => ({
      id: node.id,
      position: node.position,
      data: {
        isFirstNode: !!node.data?.isFirstNode,
        options: Array.isArray(node.data?.options) ? node.data.options.map(opt => ({
          id: opt.id,
          text: opt.text
        })) : [],
        title: node.data?.title || "",
        type: node.data?.type || "options",
        answerText: node.data?.answerText || "",
        endText: node.data?.endText || ""
      }
    })),
    edges: flow.edges.map(edge => ({
      source: edge.source,
      sourceHandle: edge.sourceHandle || "text-output",
      target: edge.target
    }))
  };
}

// Fix ResizeObserver loop error
const resizeObserverErrorHandler = () => {
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const _ResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
      callback = debounce(callback, 16);
      super(callback);
    }
  };
};

// Apply the fix on component mount
if (typeof window !== 'undefined') {
  resizeObserverErrorHandler();
}

function Questionaire() {
  const navigate = useNavigate();
  const [currentFlow, setCurrentFlow] = useState(null);
  const fileInputRef = useRef(null);
  const questionFlowRef = useRef(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [viewNodes, setViewNodes] = useNodesState([]);
  const [viewEdges, setViewEdges] = useEdgesState([]);
  const [aiQuestionnaireData, setAiQuestionnaireData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [flowKey, setFlowKey] = useState(0);
  const [campaignName, setCampaignName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }

    const savedQuestionnaire = localStorage.getItem('questionnaire');
    if (savedQuestionnaire && !dataLoaded) {
      try {
        console.log("Loading questionnaire from localStorage in Questionaire component");
        const parsedData = JSON.parse(savedQuestionnaire);
        setAiQuestionnaireData(parsedData);
        setCurrentFlow(parsedData);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error parsing questionnaire data:", error);
      }
    }
  }, [navigate, dataLoaded]);

  useEffect(() => {
    if (aiQuestionnaireData && questionFlowRef.current && questionFlowRef.current.initializeFlow) {
      console.log("Initializing flow with AI data in Questionaire component");
      setTimeout(() => {
        questionFlowRef.current.initializeFlow(aiQuestionnaireData);
      }, 1000);
    }
  }, [aiQuestionnaireData, flowKey]);

  useEffect(() => {
    const savedData = localStorage.getItem("questionnaireCategories");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setCampaignName(parsedData.campaignName);
    }
  }, []);

  // Handle ResizeObserver errors gracefully
  useEffect(() => {
    const handleResizeObserverError = (e) => {
      if (e.message.includes('ResizeObserver loop')) {
        e.stopImmediatePropagation();
        return false;
      }
    };

    window.addEventListener('error', handleResizeObserverError);
    
    return () => {
      window.removeEventListener('error', handleResizeObserverError);
    };
  }, []);

  const handleFlowChange = (flowData) => {
    setCurrentFlow(flowData);
  };

  const handleExport = () => {
    if (questionFlowRef.current && questionFlowRef.current.exportFlow) {
      questionFlowRef.current.exportFlow();
    }
  };

  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleback = () => {
    if (isViewMode) {
      setIsViewMode(false);

      setTimeout(() => {
        setFlowKey(prev => prev + 1);
      }, 50);
    } else {
      if (currentFlow) {
        localStorage.setItem('questionnaire', JSON.stringify(currentFlow));
      }
      
      localStorage.setItem('openModalAtStep', '2');
      navigate("/app");
    }
  };

  const handleFinalizeCampaign = () => {
    if (currentFlow) {
      const finalizedFlow = JSON.parse(JSON.stringify(currentFlow));
      localStorage.setItem('questionnaire', JSON.stringify(finalizedFlow));
      setAiQuestionnaireData(finalizedFlow);

      // For preview, use the full node/edge objects, just add isViewOnly
      setViewNodes(finalizedFlow.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isViewOnly: true,
        }
      })));
      setViewEdges(finalizedFlow.edges.map(edge => ({
        ...edge
      })));
      setIsViewMode(true);
    } else {
      alert("Please create a questionnaire before finalizing.");
    }
  };

  const handleLaunch = async () => {
    const token = localStorage.getItem("accessToken");
    
    // Validate required data
    if (!currentFlow || !currentFlow.nodes || currentFlow.nodes.length === 0) {
      alert("Please create a questionnaire with at least one question before launching.");
      return;
    }

    if (!campaignName || campaignName.trim() === "") {
      alert("Please enter a campaign name before launching.");
      return;
    }

    // Get actual data from localStorage or state
    const savedCategories = localStorage.getItem("questionnaireCategories");
    let organization = "Your Organization";
    let positionId = "GUID";
    let recruiterID = "GUID";

    if (savedCategories) {
      try {
        const parsedData = JSON.parse(savedCategories);
        organization = parsedData.organization || organization;
        positionId = parsedData.positionId || positionId;
        recruiterID = parsedData.recruiterID || recruiterID;
      } catch (error) {
        console.error("Error parsing questionnaire categories:", error);
      }
    }

    // Prepare the questionnaire data - match backend expected structure exactly
    const cleanQuestionnaire = sanitizeQuestionnaire(currentFlow);

    const hasInvalidNode = cleanQuestionnaire.nodes.some(n => !n.data);
    const hasInvalidEdge = cleanQuestionnaire.edges.some(e => !e.sourceHandle);

    if (hasInvalidNode || hasInvalidEdge) {
      alert("Invalid questionnaire structure: All nodes must have data and all edges must have sourceHandle.");
      return;
    }

    const payload = {
      name: campaignName.trim(),
      organization: organization.trim(),
      positionId: positionId.trim(),
      questionnaire: cleanQuestionnaire,
      recruiterID: recruiterID,
      sendDTTM: new Date().toISOString(),
      status: "Active",
      style: "SMS",
      tags: ["tag1", "tag2"]
    };

    console.log("Payload to backend:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(
        "https://lyncitapplications.xyz:8086/campaign/",
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Credentials": "true"
          },
          withCredentials: true
        }
      );
      
      console.log("Campaign launched successfully:", response.data);
      alert("Campaign launched successfully!");
      navigate("/campaign");
    } catch (error) {
      console.error("Launch campaign error:", error);
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 422) {
          console.error("Validation errors:", data);
          alert(`Validation error: ${data.message || 'Please check your questionnaire data and try again.'}`);
        } else if (status === 401) {
          alert("Authentication failed. Please log in again.");
          navigate("/");
        } else if (status === 400) {
          alert(`Bad request: ${data.message || 'Please check your data and try again.'}`);
        } else {
          alert(`Server error (${status}): ${data.message || 'Please try again later.'}`);
        }
      } else if (error.request) {
        // Network error
        alert("Network error. Please check your connection and try again.");
      } else {
        // Other error
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-white">
        <div className="px-14 max-lg:px-8 mb-8 max-sm:hidden">
          <div className="flex items-center justify-between pt-3">
            <div>
              <Logo />
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-semibold text-black">
                {campaignName ? `${campaignName} - ` : ""}{isViewMode ? "Campaign Preview" : "Campaign Dashboard"}
              </h1>
              {/* {campaignName && (
                <span className="text-sm text-gray-600 mt-1">{campaignName}</span>
              )} */}
            </div>
            <span className="text-xs text-gray-500">Powered By Lyncit AI</span>
          </div>

          <div className="flex items-center justify-between pt-3">
            <button onClick={handleback} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
              <ArrowLeft size={16} />
              {isViewMode ? "Back to Editor" : "Back"}
            </button>

            {isViewMode ? (
              <button 
                onClick={handleLaunch}
                className="px-14 py-3 text-sm font-medium text-white bg-[rgb(122,86,144,1)] rounded-full hover:bg-[rgb(122,86,144,0.9)]"
              >
                Launch
              </button>
            ) : (
              <button 
                onClick={handleFinalizeCampaign} 
                className="px-14 py-3 text-sm font-medium text-white bg-[rgb(122,86,144,1)] rounded-full hover:bg-[rgb(122,86,144,0.9)]"
              >
                Finalize the Campaign
              </button>
            )}
            <div></div>
          </div>
        </div>
        
        <div className="sm:hidden flex justify-between px-8 my-11">
          <div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12H15M3 6H21M3 18H21"
                stroke="#637083"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.35493 21C10.0601 21.6224 10.9863 22 12.0008 22C13.0152 22 13.9414 21.6224 14.6466 21M18.0008 8C18.0008 6.4087 17.3686 4.88258 16.2434 3.75736C15.1182 2.63214 13.5921 2 12.0008 2C10.4095 2 8.88333 2.63214 7.75811 3.75736C6.63289 4.88258 6.00075 6.4087 6.00075 8C6.00075 11.0902 5.22122 13.206 4.35042 14.6054C3.61588 15.7859 3.24861 16.3761 3.26208 16.5408C3.27699 16.7231 3.31561 16.7926 3.46253 16.9016C3.59521 17 4.19334 17 5.38961 17H18.6119C19.8082 17 20.4063 17 20.539 16.9016C20.6859 16.7926 20.7245 16.7231 20.7394 16.5408C20.7529 16.3761 20.3856 15.7859 19.6511 14.6054C18.7803 13.206 18.0008 11.0902 18.0008 8Z"
                stroke="#637083"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {isViewMode ? (
          <div className="px-14 max-lg:px-8">
            <div className="flex justify-center sm:hidden">
              <button 
                onClick={handleLaunch}
                className="px-14 py-3 mb-6 text-sm font-medium text-white bg-[rgb(122,86,144,1)] rounded-full hover:bg-[rgb(122,86,144,0.9)]"
              >
                Launch
              </button>
            </div>
            <div className="h-[calc(90vh-4rem)] border rounded-[16px] overflow-hidden border-[#F1EAF6]">
              <ReactFlow
                nodes={viewNodes}
                edges={viewEdges}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={edgeOptions}
                edgeOptions={edgeOptions}
                proOptions={{ hideAttribution: true }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                fitView
                fitViewOptions={{ padding: 0.1 }}
                onError={(error) => {
                  console.warn('ReactFlow error:', error);
                }}
              >
              </ReactFlow>
            </div>
          </div>
        ) : (
          <>
            {/* Top Sidebar/Toolbar - Only on small screens */}
            <div className="lg:hidden px-8 py-4 border-b border-gray-200">
              <Sidebar
                onExport={handleExport}
                onImport={handleImport}
                fileInputRef={fileInputRef}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            </div>

            {/* Desktop Layout - Side by side */}
            <div className="hidden lg:flex w-full h-full relative">
              {/* Sidebar */}
              <div
                className={`
                  transition-all duration-300
                  overflow-hidden
                  ${sidebarOpen ? 'w-80 min-w-[20rem]' : 'w-0 min-w-0'}
                  relative
                `}
              >
                <Sidebar
                  onExport={handleExport}
                  onImport={handleImport}
                  fileInputRef={fileInputRef}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                {sidebarOpen && (
                  <button
                    className="absolute top-6 right-2 bg-white border rounded-full shadow p-1 z-20"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Collapse sidebar"
                  >
                    {/* Left chevron icon */}
                    <svg width="20" height="20" fill="none">
                      <path d="M13 5l-5 5 5 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
              {/* Expand button */}
              {!sidebarOpen && (
                <button
                  className="absolute left-4 top-24 z-30 bg-white border rounded-full shadow p-1"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  {/* Right chevron icon */}
                  <svg width="20" height="20" fill="none">
                    <path d="M7 5l5 5-5 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              {/* Canvas */}
              <div className="flex-1 transition-all duration-300 ml-0">
                <QuestionFlow
                  key={flowKey}
                  ref={questionFlowRef}
                  onFlowChange={handleFlowChange}
                  fileInputRef={fileInputRef}
                  initialAIData={aiQuestionnaireData}
                  preventDummyLoad={dataLoaded}
                />
              </div>
            </div>

            {/* Mobile Canvas */}
            <div className="lg:hidden px-8 py-4">
              <div className="flex justify-center mb-4">
                <button 
                  onClick={handleFinalizeCampaign}
                  className="px-14 py-3 text-sm font-medium text-white bg-[rgb(122,86,144,1)] rounded-full hover:bg-[rgb(122,86,144,0.9)]"
                >
                  Finalize the Campaign
                </button>
              </div>
              <QuestionFlow
                key={flowKey}
                ref={questionFlowRef}
                onFlowChange={handleFlowChange}
                fileInputRef={fileInputRef}
                initialAIData={aiQuestionnaireData}
                preventDummyLoad={dataLoaded}
              />
            </div>
          </>
        )}
      </div>
    </DndProvider>
  );
}

export default Questionaire;