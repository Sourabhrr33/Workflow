import { ADD_STEP, SAVE_WORKFLOW } from "./workflow.action";

const initialState = {
  steps: [
    { id: "start", data: { label: "Start" }, position: { x: 250, y: 50 } },
    { id: "end", data: { label: "End" }, position: { x: 250, y: 400 } }
  ]
};

const workflowReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_STEP:
      const newStep = {
        id: `step-${state.steps.length}`,
        data: { label: action.payload.type },
        position: { x: 250, y: 100 + state.steps.length * 100 }
      };
      return { ...state, steps: [...state.steps, newStep] };

    case SAVE_WORKFLOW:
      return { ...state, savedSteps: action.payload };

    default:
      return state;
  }
};

export default workflowReducer;
