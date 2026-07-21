import { message } from "antd";
import axios from "axios";

const API_URL = "https://car-rental-system-dkt6.onrender.com";

export const getAllCars = () => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    const response = await axios.get(
      `${API_URL}/api/cars/getallcars`
    );

    console.log("Cars API response:", response.data);

    dispatch({
      type: "GET_ALL_CARS",
      payload: response.data,
    });
  } catch (error) {
    console.error(
      "Failed to load cars:",
      error.response?.data || error.message
    );

    message.error("Failed to load cars");
  } finally {
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};

export const addCar = (reqObj) => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    await axios.post(`${API_URL}/api/cars/addcar`, reqObj);

    message.success("New car added successfully");

    setTimeout(() => {
      window.location.href = "/admin";
    }, 500);
  } catch (error) {
    console.error(error.response?.data || error.message);
    message.error("Failed to add car");
  } finally {
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};

export const editCar = (reqObj) => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    await axios.post(`${API_URL}/api/cars/editcar`, reqObj);

    message.success("Car details updated successfully");

    setTimeout(() => {
      window.location.href = "/admin";
    }, 500);
  } catch (error) {
    console.error(error.response?.data || error.message);
    message.error("Failed to edit car");
  } finally {
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};

export const deleteCar = (reqObj) => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    await axios.post(`${API_URL}/api/cars/deletecar`, reqObj);

    message.success("Car deleted successfully");

    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.error(error.response?.data || error.message);
    message.error("Failed to delete car");
  } finally {
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};