export const ADD_STEP = "ADD_STEP";
export const SAVE_WORKFLOW = "SAVE_WORKFLOW";

export const addStep = (step) => ({
  type: ADD_STEP,
  payload: step,
});

export const saveWorkflow = (steps) => ({
  type: SAVE_WORKFLOW,
  payload: steps,
});
