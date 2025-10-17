// src/redux/reducer/userReducer.js
import {
  FETCH_USER_LOGIN_SUCCESS,
  FETCH_USER_LOGIN_FAIL,
} from "../action/userAction";

const INITIAL_STATE = {
  account: {
    access_token: "",
    refresh_token: "",
    username: "",
    email: "",
    role: "",
    id: "",
    active : true,//
  },
  isAuthenticated: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_LOGIN_SUCCESS:
      //  const userData = action.payload.user || {};// thaygpt/gimi chỉ hoặc hại t
      return {
        ...state,
        account: {
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
          username: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
          id: action.payload.id || action.payload._id || "", // nếu backend có trả id
          active: action.payload.active ,//
        },
        isAuthenticated: true,
      };

    case FETCH_USER_LOGIN_FAIL:
      return {
        ...state,
        account: INITIAL_STATE.account,
        isAuthenticated: false, 
      };

    default:
      return state;
  }
};

export default userReducer;
