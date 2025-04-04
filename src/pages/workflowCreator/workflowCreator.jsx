import React, { useState, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  MarkerType,
  MiniMap
} from "reactflow";
import "reactflow/dist/style.css";
import styles from "./WorkflowCreator.module.scss";
import save from "../../assets/saveIcon.svg";
import { useNavigate, useParams } from "react-router-dom";
import { 
  addDoc, 
  collection, 
  doc, 
  updateDoc, 
  getDoc
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import CustomNode from "./CustomeNode";

const WorkflowCreator = () => {
  const { id } = useParams();
  const [nodes, setNodes] = useState([
    { 
      id: "1", 
      type: "customNode", 
      position: { x: 400, y: 100 }, 
      data: { 
        label: "Start", 
        color: "green",
        type: "start"
      } 
    },
    { 
      id: "2", 
      type: "customNode", 
      position: { x: 400, y: 300 }, 
      data: { 
        label: "End",
        color: "red",
        type: "end"
      } 
    },
  ]);

  const [edges, setEdges] = useState([
    { 
      id: "e1-2", 
      source: "1", 
      target: "2", 
      animated: true, 
      markerEnd: { 
        type: MarkerType.ArrowClosed 
      } 
    },
  ]);

  const [workflowDetails, setWorkflowDetails] = useState({
    name: "Untitled Workflow",
    description: ""
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const navigate = useNavigate();
  const nodeTypes = { customNode: CustomNode };

  // Load workflow if editing
  useEffect(() => {
    if (id) {
      const loadWorkflow = async () => {
        setIsLoading(true);
        try {
          const docRef = doc(db, "workflows", id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setWorkflowDetails({
              name: data.name,
              description: data.description || ""
            });
            setNodes(data.nodes || nodes);
            setEdges(data.edges || edges);
          }
        } catch (error) {
          console.error("Error loading workflow:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadWorkflow();
    }
  }, [id]);

  const handleAddNode = (index, type) => {
    const newNodeId = `${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: "customNode",
      position: { x: 400, y: 0 },
      data: { 
        label: type,
        type: type.toLowerCase().replace(" ", "-")
      },
    };

    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];
      updatedNodes.splice(index + 1, 0, newNode);
      return updatedNodes.map((node, idx) => ({
        ...node,
        position: { x: 400, y: 100 + idx * 150 },
      }));
    });

    setEdges((prevEdges) => {
      const updatedEdges = prevEdges.filter(
        (edge) => !(edge.source === nodes[index].id && edge.target === nodes[index + 1]?.id)
      );

      return [
        ...updatedEdges,
        { 
          id: `e${nodes[index].id}-${newNodeId}`, 
          source: nodes[index].id, 
          target: newNodeId, 
          animated: true, 
          markerEnd: { type: MarkerType.ArrowClosed } 
        },
        { 
          id: `e${newNodeId}-${nodes[index + 1]?.id}`, 
          source: newNodeId, 
          target: nodes[index + 1]?.id, 
          animated: true, 
          markerEnd: { type: MarkerType.ArrowClosed } 
        },
      ];
    });

    setShowMenuIndex(null);
  };

  const handleBack = () => {
    navigate("/workflow");
  };

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!auth.currentUser) {
        throw new Error("User must be logged in to save workflows");
      }
  
      const workflowData = {
        name: workflowDetails.name,
        description: workflowDetails.description,
        nodes: nodes.map(node => ({
          ...node,
          // Ensure position is serializable
          position: { 
            x: node.position.x, 
            y: node.position.y 
          }
        })),
        edges,
        lastEdited: new Date(),
        createdBy: auth.currentUser.uid,
        statusHistory: [{
          timestamp: new Date().toLocaleString(),
          status: "Created"
        }]
      };
  
      console.log("Saving workflow data:", workflowData); // Debug log
  
      if (id) {
        await updateDoc(doc(db, "workflows", id), workflowData);
        setSaveMessage("✅ Workflow updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "workflows"), workflowData);
        console.log("Document written with ID: ", docRef.id);
        setSaveMessage("✅ Workflow saved successfully!");
      }
      
      // Close modal after short delay
      setTimeout(() => {
        setShowSaveModal(false);
        navigate("/workflow"); // Redirect to list view after save
      }, 1500);
    } catch (error) {
      console.error("Save error:", error);
      setSaveMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleNodeConfigChange = (key, value) => {
    setNodes(nodes.map(node => 
      node.id === selectedNode.id 
        ? { ...node, data: { ...node.data, [key]: value } }
        : node
    ));
  };

  const handleDeleteNode = (id) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.filter((node) => node.id !== id);
      return updatedNodes.map((node, idx) => ({
        ...node,
        position: { x: 400, y: 100 + idx * 150 },
      }));
    });

    setEdges((prevEdges) => {
      let updatedEdges = prevEdges.filter((edge) => edge.source !== id && edge.target !== id);
      const deletedNodeIndex = nodes.findIndex((node) => node.id === id);
      
      if (deletedNodeIndex > 0 && deletedNodeIndex < nodes.length - 1) {
        updatedEdges.push({
          id: `e${nodes[deletedNodeIndex - 1].id}-${nodes[deletedNodeIndex + 1]?.id}`,
          source: nodes[deletedNodeIndex - 1].id,
          target: nodes[deletedNodeIndex + 1]?.id,
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      return updatedEdges;
    });
  };

  return (
    <div className={styles.workflowContainer}>
      <div className={styles.topButtons}>
        <button className={styles.Button} onClick={handleBack}>
          ← Go Back
        </button>
        <button 
          className={styles.saveButton} 
          onClick={handleSaveClick}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Workflow"}
        </button>
        <img 
          src={save} 
          alt="Save" 
          onClick={handleSaveClick}
          className={styles.saveIcon}
        />
        {saveMessage && (
          <div className={styles.saveMessage}>
            {saveMessage}
          </div>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h3>Save Workflow</h3>
      <div className={styles.formGroup}>
        <label>Workflow Name *</label>
        <input
          type="text"
          value={workflowDetails.name}
          onChange={(e) => setWorkflowDetails({
            ...workflowDetails,
            name: e.target.value
          })}
          required
          minLength={3}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Description</label>
        <textarea
          value={workflowDetails.description}
          onChange={(e) => setWorkflowDetails({
            ...workflowDetails,
            description: e.target.value
          })}
          rows={3}
        />
      </div>
      {saveMessage && (
        <div className={saveMessage.includes("✅") ? styles.successMessage : styles.errorMessage}>
          {saveMessage}
        </div>
      )}
      <div className={styles.modalActions}>
        <button 
          onClick={handleSave}
          disabled={isLoading || !workflowDetails.name.trim()}
          className={styles.confirmButton}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span> Saving...
            </>
          ) : "Confirm Save"}
        </button>
        <button 
          onClick={() => setShowSaveModal(false)}
          disabled={isLoading}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      <div className={styles.flowContainer}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(e, node) => setSelectedNode(node)}
          nodeTypes={nodeTypes}
          panOnDrag
          zoomOnScroll
          zoomOnDoubleClick
          fitView
          attributionPosition="top-right"
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className={styles.configPanel}>
          <h3>{selectedNode.data.label} Configuration</h3>
          <div className={styles.configSection}>
            <label>Node Name:</label>
            <input
              value={selectedNode.data.label}
              onChange={(e) => handleNodeConfigChange("label", e.target.value)}
              className={styles.configInput}
            />
          </div>
          
          {selectedNode.data.type === "api-call" && (
            <>
              <div className={styles.configSection}>
                <label>Endpoint URL:</label>
                <input
                  value={selectedNode.data.endpoint || ""}
                  onChange={(e) => handleNodeConfigChange("endpoint", e.target.value)}
                  className={styles.configInput}
                  placeholder="https://api.example.com/endpoint"
                />
              </div>
              <div className={styles.configSection}>
                <label>Method:</label>
                <select
                  value={selectedNode.data.method || "GET"}
                  onChange={(e) => handleNodeConfigChange("method", e.target.value)}
                  className={styles.configSelect}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
            </>
          )}
          
          {selectedNode.data.type === "email" && (
            <>
              <div className={styles.configSection}>
                <label>Recipient Email:</label>
                <input
                  type="email"
                  value={selectedNode.data.recipient || ""}
                  onChange={(e) => handleNodeConfigChange("recipient", e.target.value)}
                  className={styles.configInput}
                  placeholder="user@example.com"
                />
              </div>
              <div className={styles.configSection}>
                <label>Subject:</label>
                <input
                  value={selectedNode.data.subject || ""}
                  onChange={(e) => handleNodeConfigChange("subject", e.target.value)}
                  className={styles.configInput}
                  placeholder="Email subject"
                />
              </div>
            </>
          )}
          
          <button 
            onClick={() => setSelectedNode(null)}
            className={styles.closeButton}
          >
            Close Configuration
          </button>
        </div>
      )}

      {nodes.map((node, index) => (
        index !== nodes.length - 1 && (
          <div 
            key={`plus-${node.id}`}
            className={styles.plusButtonContainer}
            style={{
              top: node.position.y + 100,
              left: "50%"
            }}
          >
            <button
              onClick={() => setShowMenuIndex(showMenuIndex === index ? null : index)}
              className={styles.plusButton}
            >
              ➕
            </button>

            {showMenuIndex === index && (
              <div className={styles.nodeMenu}>
                <div onClick={() => handleAddNode(index, "API Call")}>API Call</div>
                <div onClick={() => handleAddNode(index, "Text")}>Text</div>
                <div onClick={() => handleAddNode(index, "Email")}>Email</div>
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default WorkflowCreator;