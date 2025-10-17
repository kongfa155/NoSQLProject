import axios from "axios";

export const FETCH_USER_LOGIN_SUCCESS = "FETCH_USER_LOGIN_SUCCESS";
export const FETCH_USER_LOGIN_FAIL = "FETCH_USER_LOGIN_FAIL";

export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials
      );

      if (res.status === 200) {
        const data = res.data;

        dispatch({
          type: FETCH_USER_LOGIN_SUCCESS,
          payload: data,
        });
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken); // cần lưu
        // ✅ Trả lại data để component có thể await
        return data;
      }
    } catch (error) {
      console.error("Login failed:", error);
      dispatch({ type: FETCH_USER_LOGIN_FAIL });
      throw error;
    }
  };
};

export const handleLogout = (dispatch) => {
  // 1️⃣ Xóa dữ liệu trong localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.removeItem("id");

  // 2️⃣ Reset state user trong redux
  dispatch({ type: FETCH_USER_LOGIN_FAIL });
};

