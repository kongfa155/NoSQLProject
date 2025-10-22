// src/redux/reducer/rootReducer.js
import { combineReducers } from "redux";
import userReducer from "./userReducer";
import viewModeReducer from "./viewModeReduce";

const rootReducer = combineReducers({
  user: userReducer,
  viewMode: viewModeReducer, // tên state bạn muốn gọi là "user"
});

export default rootReducer;
