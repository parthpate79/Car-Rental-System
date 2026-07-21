import axios from "axios";
import { message } from "antd";

const API = "https://car-rental-system-dkt6.onrender.com";

// ================= BOOK CAR =================

export const bookCar = (reqObj) => async (dispatch) => {

  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {

    await axios.post(
      `${API}/api/bookings/bookcar`,
      reqObj
    );

    dispatch({
      type: "LOADING",
      payload: false,
    });

    message.success("Your car booked successfully");

    setTimeout(() => {
      window.location.href = "/userbookings";
    }, 500);

  } catch (error) {

    console.log(error);

    dispatch({
      type: "LOADING",
      payload: false,
    });

    message.error("Something went wrong");

  }

};

// ================= GET ALL BOOKINGS =================

export const getAllBookings = () => async (dispatch) => {

  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {

    const response = await axios.get(
      `${API}/api/bookings/getallbookings`
    );

    dispatch({
      type: "GET_ALL_BOOKINGS",
      payload: response.data,
    });

    dispatch({
      type: "LOADING",
      payload: false,
    });

  } catch (error) {

    console.log(error);

    dispatch({
      type: "LOADING",
      payload: false,
    });

    message.error("Failed to load bookings");

  }

};