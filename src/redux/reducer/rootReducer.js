// src/redux/reducer/rootReducer.js
import { combineReducers } from "redux";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  user: userReducer, // tên state bạn muốn gọi là "user"
});

export default rootReducer;
