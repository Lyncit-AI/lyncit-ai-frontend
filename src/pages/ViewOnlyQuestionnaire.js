import React, { useEffect } from "react";
import ReactFlow, { useNodesState, useEdgesState } from "reactflow";
import { useNavigate, useLocation } from "react-router-dom";
import { QuestionNode } from "../components/recruiter/QuestionNode";
import { ArrowLeft } from "lucide-react";
import Logo from "../assets/icons/keylogo";
import "reactflow/dist/style.css";

const nodeTypes = {
  questionNode: QuestionNode,
};

const edgeOptions = {
  style: { strokeDasharray: "5,5" },
  type: "smoothstep",
  animated: true,
};

function ViewOnlyQuestionnaire() {
  const navigate = useNavigate();
  const location = useLocation();
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }

    // Retrieve flow data passed from the Questionaire component
    if (location.state?.flowData) {
      const { nodes: flowNodes, edges: flowEdges } = location.state.flowData;
      
      // Add isViewOnly flag to each node
      const viewOnlyNodes = flowNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isViewOnly: true,
        }
      }));
      
      setNodes(viewOnlyNodes);
      setEdges(flowEdges);
    } else {
      console.error("No flow data found in location state");
    }
  }, [navigate, location.state, setNodes, setEdges]);

  const handleBack = () => {
    navigate("/question");
  };

  const handleLaunch = () => {
    // Implement launch functionality here
    alert("Campaign launched successfully!");
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-14 max-lg:px-8 mb-8">
        <div className="flex items-center justify-between pt-3">
          <div>
            <Logo />
          </div>
          <h1 className="text-lg font-semibold text-black">
            Campaign Preview
          </h1>
          <span className="text-xs text-gray-500">Powered By Lyncit AI</span>
        </div>

        <div className="flex items-center justify-between pt-3">
          <button onClick={handleBack} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
            <ArrowLeft size={16} />
            Back to Editor
          </button>

          <button 
            onClick={handleLaunch}
            className="px-14 py-3 text-sm font-medium text-white bg-[rgb(122,86,144,1)] rounded-full hover:bg-[rgb(122,86,144,0.9)]"
          >
            Launch
          </button>
          <div></div>
        </div>
      </div>

      <div className="px-14 max-lg:px-8">
        <div className="h-[calc(90vh-4rem)] border rounded-[16px] overflow-hidden border-[#F1EAF6]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={edgeOptions}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
          >
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default ViewOnlyQuestionnaire;