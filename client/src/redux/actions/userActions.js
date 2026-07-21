import axios from "axios";
import { message } from "antd";

const API_URL = "https://car-rental-system-dkt6.onrender.com";

export const userLogin = (reqObj) => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    const response = await axios.post(
      `${API_URL}/api/users/login`,
      reqObj
    );

    localStorage.setItem("user", JSON.stringify(response.data));

    message.success("Login successful");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  } catch (error) {
    console.error("Login error:", error);

    message.error(
      error.response?.data?.message ||
      "Invalid username or password"
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
    await axios.post(
      `${API_URL}/api/users/register`,
      reqObj
    );

    message.success("Registration successful");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  } catch (error) {
    console.error("Registration error:", error);

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