import axios from "axios";
import { message } from "antd";

export const userLogin = (reqObj) => async dispatch => {

    dispatch({ type: 'LOADING', payload: true });

    try {

        const response = await axios.post(
            "http://https://car-rental-system-dkt6.onrender.com/api/users/login",
            reqObj
        );

        localStorage.setItem("user", JSON.stringify(response.data));

        message.success("Login Success");

        dispatch({ type: 'LOADING', payload: false });

        window.location.href = "/";

    } catch (error) {

        console.log(error);

        message.error("Something went wrong");

        dispatch({ type: 'LOADING', payload: false });

    }

};

export const userRegister = (reqObj) => async dispatch => {

    dispatch({ type: 'LOADING', payload: true });

    try {

        await axios.post(
            "http://car-rental-system-dkt6.onrender.com/api/users/register",
            reqObj
        );

        message.success("Registration Successful");

        dispatch({ type: 'LOADING', payload: false });

        window.location.href = "/login";

    } catch (error) {

        console.log(error);

        message.error("Something went wrong");

        dispatch({ type: 'LOADING', payload: false });

    }

};