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
      }, 500);
    }
  }, [aiQuestionnaireData, flowKey]);

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
      
      const serializableNodes = currentFlow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          id: node.data.id,
          type: node.data.type,
          title: node.data.title,
          options: node.data.options,
          isFirstNode: node.data.isFirstNode,
          answerText: node.data.answerText,
          endText: node.data.endText,
          isViewOnly: true,
        }
      }));
      
      const serializableEdges = currentFlow.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        style: edge.style,
        animated: edge.animated
      }));
      
      setViewNodes(serializableNodes);
      setViewEdges(serializableEdges);
      setIsViewMode(true);
    } else {
      alert("Please create a questionnaire before finalizing.");
    }
  };

  const handleLaunch = () => {
    alert("Campaign launched successfully!");
    navigate("/campaign");
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
            <h1 className="text-lg font-semibold text-black">
              {isViewMode ? "Campaign Preview" : "Campaign Dashboard"}
            </h1>
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
              >
              </ReactFlow>
            </div>
          </div>
        ) : (
          <div className="md:flex px-14 max-lg:px-8 max-md:flex-col">
            <Sidebar
              onExport={handleExport}
              onImport={handleImport}
              fileInputRef={fileInputRef}
            />
            <div className="flex justify-center sm:hidden">
              <button 
                onClick={handleFinalizeCampaign}
                className="px-14 py-3 my-6 text-sm font-medium text-white bg-[rgb(122,86,144,1)] rounded-full hover:bg-[rgb(122,86,144,0.9)]"
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
        )}
      </div>
    </DndProvider>
  );
}

export default Questionaire;