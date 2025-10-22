import { SET_VIEW_MODE } from "../action/viewModeAction";


const INITIAL_STATE = {
  mode: "edit",
};

const viewModeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_VIEW_MODE:
        return ({...state, mode: action.payload});
    default:
      return state;
  }
};

export default viewModeReducer;
