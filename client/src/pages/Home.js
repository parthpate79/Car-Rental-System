import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { getAllCars } from "../redux/actions/carsActions";
import { Row, Col, DatePicker, Card } from "antd";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import moment from "moment";

import {
  CarOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;

function Home() {

  const dispatch = useDispatch();

  const carsReducer = useSelector((state) => state.carsReducer);

const cars = carsReducer?.cars || [];
  const alertsReducer = useSelector((state) => state.alertsReducer);

const loading = alertsReducer?.loading || false;

  const [totalCars, setTotalCars] = useState([]);

  useEffect(() => {
    dispatch(getAllCars());
  }, []);

  useEffect(() => {
    setTotalCars(cars);
  }, [cars]);

  function setFilter(values) {

    if (!values) {
      setTotalCars(cars);
      return;
    }

    const selectedFrom = moment(values[0]);
    const selectedTo = moment(values[1]);

    let temp = [];

    for (let car of cars) {

      if (!car.bookedTimeSlots || car.bookedTimeSlots.length === 0) {

        temp.push(car);

      } else {

        let available = true;

        for (let booking of (car.bookedTimeSlots || [])){

          if (
            selectedFrom.isBetween(booking.from, booking.to) ||
            selectedTo.isBetween(booking.from, booking.to) ||
            moment(booking.from).isBetween(selectedFrom, selectedTo) ||
            moment(booking.to).isBetween(selectedFrom, selectedTo)
          ) {
            available = false;
          }

        }

        if (available) {
          temp.push(car);
        }

      }

    }

    setTotalCars(temp);

  }

  return (

    <DefaultLayout>

      {loading && <Spinner />}

      <div
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",
          color: "white",
          padding: "60px",
          borderRadius: "20px",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >

        <h1
          style={{
            color: "white",
            fontSize: "50px",
          }}
        >
          Premium Car Rental
        </h1>

        <p
          style={{
            fontSize: "18px",
            opacity: .9,
          }}
        >
          Luxury • Sports • SUV • Family Cars
        </p>

      </div>

      <Row gutter={20} style={{ marginBottom: 30 }}>

        <Col lg={6} xs={24}>
          <Card className="stats-card">
            <CarOutlined style={{ fontSize: 40, color: "#2563eb" }} />
            <h2>{cars.length}+</h2>
            <p>Total Cars</p>
          </Card>
        </Col>

        <Col lg={6} xs={24}>
          <Card className="stats-card">
            <ClockCircleOutlined style={{ fontSize: 40, color: "#2563eb" }} />
            <h2>24/7</h2>
            <p>Support</p>
          </Card>
        </Col>

        <Col lg={6} xs={24}>
          <Card className="stats-card">
            <SafetyCertificateOutlined style={{ fontSize: 40, color: "#2563eb" }} />
            <h2>100%</h2>
            <p>Secure</p>
          </Card>
        </Col>

        <Col lg={6} xs={24}>
          <Card className="stats-card">
            <ThunderboltOutlined style={{ fontSize: 40, color: "#2563eb" }} />
            <h2>Fast</h2>
            <p>Booking</p>
          </Card>
        </Col>

      </Row>

      <div
        className="bs1"
        style={{
          padding: 25,
          marginBottom: 35,
          borderRadius: 15,
        }}
      >

        <h3>Select Booking Date & Time</h3>

        <RangePicker
          style={{ width: "100%" }}
          showTime={{ format: "HH:mm" }}
          format="MMM DD YYYY HH:mm"
          onChange={setFilter}
        />

      </div>

      <Row gutter={[25,25]}>
    {Array.isArray(totalCars) &&
totalCars.map((car) => (

  <Col lg={6} md={8} sm={12} xs={24} key={car._id}>

    <div
      className="bs1"
      style={{
        overflow: "hidden",
        borderRadius: "18px",
        transition: ".35s",
        background: "#fff",
      }}
    >

      <img
        src={car.image || "https://via.placeholder.com/400x250"}
        alt={car.name}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          padding: "20px",
        }}
      >

        <h3
          style={{
            marginBottom: "12px",
            fontWeight: "700",
          }}
        >
          {car.name}
        </h3>

        <p>
          👥 <b>{car.capacity || "-"}</b> Seats
        </p>

        <p>
          ⛽ <b>{car.fuelType || "-"}</b>
        </p>

        <p>
          💰 ₹ <b>{car.rentPerHour}</b> / Hour
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >

          <Link to={`/booking/${car._id}`}>

            <button
              className="btn1"
              style={{
                width: "100%",
                fontSize: "16px",
                padding: "10px 25px",
              }}
            >
              🚗 Book Now
            </button>

          </Link>

        </div>

      </div>

    </div>

  </Col>

))}
      </Row>

    </DefaultLayout>

  );
}

export default Home;