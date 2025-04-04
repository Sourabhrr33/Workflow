import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import workflowReducer from "./reducer"; // Ensure this path is correct

const rootReducer = combineReducers({
  workflow: workflowReducer, // Make sure "workflow" matches in useSelector
});

const store = createStore(rootReducer);

export default store;
