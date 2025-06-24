import React, { useRef, useCallback, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import PropTypes from "prop-types";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from "reactflow";
import { useDrop } from "react-dnd";
import { QuestionNode } from "./QuestionNode";
import dummyData from "./Data/dummy.json"; 
import "reactflow/dist/style.css";

const nodeTypes = {
  questionNode: QuestionNode,
};

const edgeOptions = {
  style: { strokeDasharray: "5,5" },
  type: "smoothstep",
  animated: true,
};

export const QuestionFlow = forwardRef(({ onFlowChange, fileInputRef, initialAIData, preventDummyLoad = false }, ref) => {
  const dropRef = useRef(null);
  const reactFlowRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [firstOptionsNodeId, setFirstOptionsNodeId] = useState(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  console.log("Initial AI Data:", initialAIData);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge({ ...params, ...edgeOptions }, edges);
      setEdges(newEdges);
      if (onFlowChange) onFlowChange({ nodes, edges: newEdges });
    },
    [setEdges, edges, nodes, onFlowChange]
  );

  const handleFlowChange = useCallback(() => {
    if (onFlowChange) onFlowChange({ nodes, edges });
  }, [nodes, edges, onFlowChange]);

  const handleNodesChange = (changes) => {
    onNodesChange(changes);
    setTimeout(() => handleFlowChange(), 0);
  };

  const handleEdgesChange = (changes) => {
    onEdgesChange(changes);
    setTimeout(() => handleFlowChange(), 0);
  };

  const getNextNodeId = useCallback(() => {
    const nextId = nodeIdCounter + 1;
    setNodeIdCounter(nextId);
    return `node_${nextId}`;
  }, [nodeIdCounter]);

  const createNode = (item, position) => {
    const newNodeId = getNextNodeId();
    const questionId = `question_${nodeIdCounter}`;
    
    let isFirstNode = false;
    if (item.type === "options" && !firstOptionsNodeId) {
      isFirstNode = true;
      setFirstOptionsNodeId(newNodeId);
    }

    const newNode = {
      id: newNodeId,
      type: "questionNode",
      position,
      data: {
        ...item,
        id: questionId,
        options: item.options || [{ id: `opt1_${questionId}`, text: "Option 1" }],
        isFirstNode: isFirstNode,
        updateNodeData: updateNodeData,
      },
    };
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    if (onFlowChange) onFlowChange({ nodes: updatedNodes, edges });
    return newNode.id;
  };

  const [, drop] = useDrop({
    accept: "question",
    drop: (item, monitor) => {
      if (!reactFlowRef.current) return;
      
      const clientOffset = monitor.getClientOffset();
      const reactFlowBounds = reactFlowRef.current.getBoundingClientRect();
      
      const position = {
        x: clientOffset.x - reactFlowBounds.left,
        y: clientOffset.y - reactFlowBounds.top
      };
      
      if (reactFlowRef.current.viewportRef) {
        const { zoom, x: panX, y: panY } = reactFlowRef.current.viewportRef.current.getViewport();
        position.x = (position.x - panX) / zoom;
        position.y = (position.y - panY) / zoom;
      }

      createNode(item, position);
    }
  });

  const simplifyFlowData = (nodes, edges) => {
    const simplifiedNodes = nodes.map(node => ({
      id: node.id,
      position: node.position,
      data: {
        type: node.data.type,
        title: node.data.title,
        isFirstNode: node.data.isFirstNode,
        options: node.data.options ? node.data.options.map(opt => ({
          id: opt.id,
          text: opt.text
        })) : undefined,
        answerText: node.data.answerText,
        endText: node.data.endText
      }
    }));

    const simplifiedEdges = edges.map(edge => ({
      source: edge.source,
      sourceHandle: edge.sourceHandle,
      target: edge.target
    }));

    return { 
      nodes: simplifiedNodes, 
      edges: simplifiedEdges 
    };
  };

  const exportFlow = () => {
    const simplifiedData = simplifyFlowData(nodes, edges);
    const jsonString = JSON.stringify(simplifiedData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "flowchart.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadFlow = (data) => {
    try {
      console.log("Loading flow data:", data);
      
      if (!data || !data.nodes || !Array.isArray(data.nodes)) {
        console.error("Invalid flow data structure");
        return false;
      }

      let highestNodeNum = 0;
      data.nodes.forEach(node => {
        const nodeNumMatch = node.id.match(/node_(\d+)/);
        if (nodeNumMatch && parseInt(nodeNumMatch[1]) > highestNodeNum) {
          highestNodeNum = parseInt(nodeNumMatch[1]);
        }
      });
      setNodeIdCounter(highestNodeNum);

      let firstOptionsId = null;
      for (const node of data.nodes) {
        if (node.data.type === "options" && node.data.isFirstNode) {
          firstOptionsId = node.id;
          break;
        }
      }
      setFirstOptionsNodeId(firstOptionsId);

      // Auto-position nodes with proper spacing (vertical layout)
      const autoPositionNodes = (nodes) => {
        const positionedNodes = [];
        const horizontalSpacing = 400; // Space between nodes horizontally
        const verticalSpacing = 350; // Increased space between levels vertically
        const startX = 100;
        const startY = 100;

        // Group nodes by their level in the flow
        const nodeLevels = new Map();
        const visited = new Set();
        
        // Find the first node (entry point)
        const firstNode = nodes.find(node => node.data.isFirstNode);
        if (firstNode) {
          nodeLevels.set(0, [firstNode]);
          visited.add(firstNode.id);
        }

        // Build level structure by following edges
        const edges = data.edges || [];
        let currentLevel = 0;
        let currentLevelNodes = nodeLevels.get(currentLevel) || [];

        while (currentLevelNodes.length > 0) {
          const nextLevelNodes = [];
          
          for (const node of currentLevelNodes) {
            // Find all nodes that this node connects to
            const connectedNodes = edges
              .filter(edge => edge.source === node.id)
              .map(edge => nodes.find(n => n.id === edge.target))
              .filter(n => n && !visited.has(n.id));

            for (const connectedNode of connectedNodes) {
              if (!visited.has(connectedNode.id)) {
                nextLevelNodes.push(connectedNode);
                visited.add(connectedNode.id);
              }
            }
          }

          if (nextLevelNodes.length > 0) {
            currentLevel++;
            nodeLevels.set(currentLevel, nextLevelNodes);
            currentLevelNodes = nextLevelNodes;
          } else {
            break;
          }
        }

        // Add any remaining unvisited nodes to the last level
        const remainingNodes = nodes.filter(node => !visited.has(node.id));
        if (remainingNodes.length > 0) {
          const lastLevel = Math.max(...nodeLevels.keys()) + 1;
          nodeLevels.set(lastLevel, remainingNodes);
        }

        // Position nodes level by level (vertical layout)
        nodeLevels.forEach((levelNodes, levelIndex) => {
          const levelY = startY + (levelIndex * verticalSpacing);
          levelNodes.forEach((node, nodeIndex) => {
            const nodeX = startX + (nodeIndex * horizontalSpacing);
            positionedNodes.push({
              ...node,
              position: {
                x: nodeX,
                y: levelY
              }
            });
          });
        });

        return positionedNodes;
      };

      const restoredNodes = autoPositionNodes(data.nodes).map((node, index) => {
        return {
          id: node.id,
          type: "questionNode",
          position: node.position,
          data: {
            id: node.data.id || `question_${node.id.split('_')[1] || index}`,
            type: node.data.type || "options",
            title: node.data.title,
            options: node.data.options || [{ id: "opt1", text: "Option 1" }],
            isFirstNode: node.data.isFirstNode || (index === 0),
            answerText: node.data.answerText || "",
            endText: node.data.endText || "",
            updateNodeData: updateNodeData,
          }
        };
      });

      const restoredEdges = (data.edges || []).map((edge, index) => ({
        id: edge.id || `edge_${index}`,
        source: edge.source,
        sourceHandle: edge.sourceHandle,
        target: edge.target,
        targetHandle: edge.targetHandle || null,
        ...edgeOptions
      }));
      
      console.log("Restored nodes with auto-positioning:", restoredNodes);
      console.log("Restored edges:", restoredEdges);
      
      setNodes([]);
      setEdges([]);
      
      setTimeout(() => {
        setNodes(restoredNodes);
        setEdges(restoredEdges);
        
        if (onFlowChange) onFlowChange({ nodes: restoredNodes, edges: restoredEdges });
      }, 50);
      
      return true;
    } catch (error) {
      console.error("Failed to load flow data:", error);
      return false;
    }
  };

  const importFlow = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          loadFlow(importedData);
        } catch (error) {
          console.error("Failed to parse flow data:", error);
          alert("Invalid flow data format.");
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }
  };

  useEffect(() => {
    if (!isInitialized && nodes.length === 0) {
      console.log("Initializing QuestionFlow...");
      
      if (initialAIData) {
        console.log("Using initialAIData from props");
        loadFlow(initialAIData);
        setIsInitialized(true);
        return;
      }
      
      if (preventDummyLoad) {
        console.log("Preventing dummy data load as requested by parent");
        setIsInitialized(true);
        return;
      }
      
      const savedQuestionnaire = localStorage.getItem('questionnaire');
      if (savedQuestionnaire) {
        try {
          console.log("Using questionnaire data from localStorage in QuestionFlow");
          const parsedData = JSON.parse(savedQuestionnaire);
          loadFlow(parsedData);
          setIsInitialized(true);
          return;
        } catch (error) {
          console.error("Error parsing localStorage data in QuestionFlow:", error);
        }
      }
      
      console.log("Falling back to dummy data");
      loadFlow(dummyData);
      setIsInitialized(true);
    }
  }, [isInitialized, nodes.length, initialAIData, preventDummyLoad]);

  const initializeFlow = useCallback((flowData) => {
    console.log("initializeFlow called with:", flowData);
    if (flowData && flowData.nodes) {
      setIsInitialized(false);
      return loadFlow(flowData);
    }
    return false;
  }, []);

  useImperativeHandle(ref, () => ({
    exportFlow,
    initializeFlow
  }));

  React.useEffect(() => {
    if (fileInputRef?.current) {
      fileInputRef.current.addEventListener('change', importFlow);
      
      return () => {
        if (fileInputRef?.current) {
          fileInputRef.current.removeEventListener('change', importFlow);
        }
      };
    }
  }, [fileInputRef]);

  drop(dropRef);

  return (
    <div className="relative flex-1 h-[calc(90vh-4rem)] bg-white ml-14 max-xl:ml-0 rounded-lg">
      <div ref={dropRef} className="h-full border rounded-[16px] overflow-hidden border-[#F1EAF6]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={edgeOptions}
          proOptions={{ hideAttribution: true }}
          ref={reactFlowRef}
        >
          <Controls/>
        </ReactFlow>
      </div>
    </div>
  );
});

QuestionFlow.displayName = 'QuestionFlow';

QuestionFlow.propTypes = {
  onFlowChange: PropTypes.func,
  fileInputRef: PropTypes.object,
  initialAIData: PropTypes.object,
  preventDummyLoad: PropTypes.bool
};