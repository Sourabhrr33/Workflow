import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Workflow from "./pages/workflow/Workflow";
import WorkflowCreator from "./pages/workflowCreator/workflowCreator";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        hello
        <Route path="/" element={<Login />} />
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/workflow-creator" element={<WorkflowCreator />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;



