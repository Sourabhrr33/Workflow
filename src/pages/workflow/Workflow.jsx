import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import styles from "./Workflow.module.scss";
import Navbar from "../../assets/Navbar.svg";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import Dot from "../../assets/dot.svg";
import { useNavigate } from "react-router-dom";

const Workflow = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  useEffect(() => {
    const fetchWorkflows = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "workflows"));
        const fetchedWorkflows = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastEdited: doc.data().lastEdited?.toDate().toLocaleString(),
          statusHistory: doc.data().statusHistory || [
            { timestamp: new Date().toLocaleString(), status: "Pending" }
          ]
        }));
        setWorkflows(fetchedWorkflows);
      } catch (error) {
        console.error("Error fetching workflows:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkflows();
  }, []);

  const handleExecute = async (workflowId) => {
    try {
      setLoading(true);
      // Simulate execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedWorkflows = workflows.map(workflow => {
        if (workflow.id === workflowId) {
          const newStatus = Math.random() > 0.3 ? "Passed" : "Failed";
          return {
            ...workflow,
            statusHistory: [
              { timestamp: new Date().toLocaleString(), status: newStatus },
              ...workflow.statusHistory
            ]
          };
        }
        return workflow;
      });
      
      setWorkflows(updatedWorkflows);
      setSelectedWorkflow(null);
    } catch (error) {
      console.error("Execution error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workflowId) => {
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      try {
        await deleteDoc(doc(db, "workflows", workflowId));
        setWorkflows(prev => prev.filter(w => w.id !== workflowId));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.workflowList}>
      {selectedWorkflow && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Execution</h3>
            <p>Are you sure you want to execute this workflow?</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.confirmButton} 
                onClick={() => handleExecute(selectedWorkflow)}
                disabled={loading}
              >
                {loading ? "Executing..." : "Confirm"}
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => setSelectedWorkflow(null)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.navbarcontainer}>
        <img src={Navbar} alt="work" />
        <div className={styles.navbartext}>Workflow Builder</div>
      </div>

      <div className={styles.subcontainer}>
        <div className={styles.minnorcontainer}>
          <input
            type="text"
            placeholder="Search By Workflow Name/ID"
            className={styles.searchbar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => navigate("/workflow-creator")}>
            + Create New Process
          </button>
        </div>
        
        {loading && !selectedWorkflow ? (
          <div className={styles.loading}>Loading workflows...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Workflow Name</th>
                <th>ID</th>
                <th>Last Edited On</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkflows.length > 0 ? (
                filteredWorkflows.map((workflow, index) => (
                  <React.Fragment key={workflow.id}>
                    <tr>
                      <td>{workflow.name}</td>
                      <td>{workflow.id}</td>
                      <td>{workflow.lastEdited}</td>
                      <td>{workflow.description || "No description"}</td>
                      <td>
                        <div className={styles.executeButton}>
                          <button 
                            className={styles.Button}
                            onClick={() => setSelectedWorkflow(workflow.id)}
                          >
                            Execute
                          </button>
                          <button 
                            className={styles.Button}
                            onClick={() => navigate(`/workflow-creator/${workflow.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.menuButton}
                            onClick={() => handleDelete(workflow.id)}
                          >
                            <img className={styles.dotimg} src={Dot} alt="Menu" />
                          </button>
                        </div>
                        <button
                          className={styles.expandbutton}
                          onClick={() => toggleExpand(index)}
                        >
                          {expandedRow === index ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === index && (
                      <tr className={styles.expandedRow}>
                        <td colSpan="5">
                          <div className={styles.statushistory}>
                            {workflow.statusHistory.map((status, idx) => (
                              <div key={idx} className={styles.statusitem}>
                                <span>{status.timestamp}</span>
                                <span
                                  className={
                                    status.status === "Passed"
                                      ? styles.statuspassed
                                      : status.status === "Failed"
                                      ? styles.statusfailed
                                      : styles.statuspending
                                  }
                                >
                                  {status.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.noResults}>
                    No workflows found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Workflow;