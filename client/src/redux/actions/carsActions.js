import { message } from "antd";
import api from "../../services/api";

// ============================================
// GET ALL CARS
// ============================================

export const getAllCars = () => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  dispatch({ type: "CARS_LOADING" });
  try {
    const response = await api.get(
      "/api/cars/getallcars"
    );

    const cars = Array.isArray(response.data)
      ? response.data
      : response.data?.data?.cars || [];



    dispatch({
      type: "GET_ALL_CARS",
      payload: cars,
    });

    return cars;
  } catch (error) {
    console.error(
      "Failed to load cars:",
      error.response?.data || error.message
    );

    dispatch({
      type: "CARS_ERROR",
      payload: "Unable to load the fleet",
    });

    message.error(
      error.response?.data?.message ||
        "Failed to load cars"
    );

    return [];
  } finally {
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};

// ============================================
// ADD CAR
// ============================================

export const addCar = (reqObj) => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    const response = await api.post(
      "/api/cars/addcar",
      reqObj
    );

    message.success(
      response.data?.message ||
        "New car added successfully"
    );

    setTimeout(() => {
      window.location.href = "/admin";
    }, 600);

    return response.data;
  } catch (error) {
    console.error(
      "Add car error:",
      error.response?.data || error.message
    );

    message.error(
      error.response?.data?.message ||
        "Failed to add car"
    );

    return null;
  } finally {
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};

// ============================================
// EDIT CAR
// ============================================

export const editCar = (reqObj) => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    const response = await api.post(
      "/api/cars/editcar",
      reqObj
    );

    message.success(
      response.data?.message ||
        "Car details updated successfully"
    );

    setTimeout(() => {
      window.location.href = "/admin";
    }, 600);

    return response.data;
  } catch (error) {
    console.error(
      "Edit car error:",
      error.response?.data || error.message
    );

    message.error(
      error.response?.data?.message ||
        "Failed to edit car"
    );

    return null;
  } finally {
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};

// ============================================
// DELETE CAR
// ============================================

export const deleteCar = (reqObj) => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    const response = await api.post(
      "/api/cars/deletecar",
      reqObj
    );

    message.success(
      response.data?.message ||
        "Car deleted successfully"
    );

    await dispatch(getAllCars());

    return response.data;
  } catch (error) {
    console.error(
      "Delete car error:",
      error.response?.data || error.message
    );

    message.error(
      error.response?.data?.message ||
        "Failed to delete car"
    );

    return null;
  } finally {
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};