import styles from "./workflowCreator.module.scss"


const CustomNode = ({ data, id }) => {
  return (
    <div className={styles.customNode}>
      <div className={styles.nodeHeader}>
        <span className={styles.nodeType}>{data.label}</span>
        {data.label !== "Start" && data.label !== "End" && (
          <button 
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteNode(id);
            }}
          >
            ×
          </button>
        )}
      </div>
      <div className={styles.nodeContent}>
        {data.label === "API Call" && data.endpoint && (
          <div className={styles.endpoint}>{data.endpoint}</div>
        )}
        {data.label === "Email" && data.recipient && (
          <div className={styles.emailPreview}>
            <div>To: {data.recipient}</div>
            <div>Subject: {data.subject}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomNode;