import authService from "../../services/authService";
import { setViewMode } from "./viewModeAction";

//Trạng thái Action
export const FETCH_USER_LOGIN_SUCCESS = "FETCH_USER_LOGIN_SUCCESS";
export const FETCH_USER_LOGIN_FAIL = "FETCH_USER_LOGIN_FAIL";

// --- Action creator: loginUser ---
// credentials = { email, password }
export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const res = await authService.login(credentials);

      if (res.status === 200 && res?.data) {
        const data = res.data;

        // Lưu dữ liệu user vào Redux
        dispatch({
          type: FETCH_USER_LOGIN_SUCCESS,
          payload: data,
        });

        //Thiết lập view mode dựa theo role
        if (data.role === "Admin") {
          dispatch(setViewMode("edit")); // Admin sẽ thấy giao diện edit
        } else {
          dispatch(setViewMode("view")); // User thấy giao diện bình thường
        }

        // Lưu token vào localStorage để giữ phiên đăng nhập
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        //Trả lại data để component có thể await
        return data;
      }
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.status === "banned") {
        // Nếu tài khoản bị banned, trả về thông tin cho UI xử lý
        return errData;
      }
      // Gọi action fail để reset state user
      dispatch({ type: FETCH_USER_LOGIN_FAIL });
      throw error;
    }
  };
};

// --- Action: handleLogout ---
// Xóa dữ liệu đăng nhập và reset Redux state
export const handleLogout = (dispatch) => {
  // Xóa dữ liệu trong localStorage Đề phòng khi lỗi xóa trong redux
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.removeItem("id");

  //Reset state user trong Redux
  dispatch({ type: FETCH_USER_LOGIN_FAIL });
};
