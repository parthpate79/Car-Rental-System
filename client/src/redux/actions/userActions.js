import { safeReturnPath } from "../../utils/rental";
import { message } from "antd";
import api from "../../services/api";

export const userLogin = (reqObj) => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    const response = await api.post("/api/users/login", {
      username: reqObj.username?.trim(),
      password: reqObj.password,
    });

    const { user, token } = response.data.data;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    message.success(response.data.message || "Login successful");

    setTimeout(() => {
      window.location.href = safeReturnPath(new URLSearchParams(window.location.search).get("next"));
    }, 500);
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);

    message.error(
      error.response?.data?.message ||
        "Unable to login. Please try again."
    );
  } finally {
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};

export const userRegister = (reqObj) => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    const response = await api.post("/api/users/register", {
      username: reqObj.username?.trim(),
      password: reqObj.password,
    });

    message.success(
      response.data.message ||
        "Registration successful. Please log in."
    );

    setTimeout(() => {
      window.location.href = `/login${window.location.search}`;
    }, 500);
  } catch (error) {
    console.error(
      "Registration error:",
      error.response?.data || error.message
    );

    message.error(
      error.response?.data?.message ||
        "Registration failed. Please try again."
    );
  } finally {
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};