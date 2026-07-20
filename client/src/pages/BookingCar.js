import { Col, Row, Divider, DatePicker, Checkbox, Modal, Tag } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { getAllCars } from "../redux/actions/carsActions";
import moment from "moment";
import { bookCar } from "../redux/actions/bookingActions";
import StripeCheckout from "react-stripe-checkout";
import { useLoaderData } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  CarOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

AOS.init();

const { RangePicker } = DatePicker;

function BookingCar() {

  const match = useLoaderData();

  const carsReducer = useSelector((state) => state.carsReducer);

const cars = carsReducer?.cars || [];

  const alertsReducer = useSelector((state) => state.alertsReducer);

const loading = alertsReducer?.loading || false;

  const dispatch = useDispatch();

  const [car, setcar] = useState({});

  const [from, setFrom] = useState();

  const [to, setTo] = useState();

  const [totalHours, setTotalHours] = useState(0);

  const [driver, setdriver] = useState(false);

  const [totalAmount, setTotalAmount] = useState(0);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    if (cars.length === 0) {

      dispatch(getAllCars());

    } else {

      setcar(cars.find((o) => o._id === match));

    }

  }, [cars]);

  const rentPerHour = car.rentPerHour || 500;

  const fuelType = car.fuelType || "Petrol";

  const capacity = car.capacity || 5;

  useEffect(() => {

    let amount = totalHours * rentPerHour;

    if (driver) {

      amount += totalHours * 30;

    }

    setTotalAmount(amount);

  }, [driver, totalHours, rentPerHour]);

  function selectTimeSlots(values) {

    if (!values) return;

    setFrom(moment(values[0]).format("MMM DD YYYY HH:mm"));

    setTo(moment(values[1]).format("MMM DD YYYY HH:mm"));

    setTotalHours(values[1].diff(values[0], "hours"));

  }

  function onToken(token) {

    const reqObj = {

      token,

      user: JSON.parse(localStorage.getItem("user"))._id,

      car: car._id,

      totalHours,

      totalAmount,

      driverRequired: driver,

      bookedTimeSlots: {

        from,

        to,

      },

    };

    dispatch(bookCar(reqObj));

  }
    return (
    <DefaultLayout>

      {loading && <Spinner />}

      <Row
        gutter={[35, 35]}
        justify="center"
        style={{
          padding: "30px 0",
          alignItems: "center",
        }}
      >

        {/* LEFT SIDE */}

        <Col lg={11} md={24} sm={24} xs={24}>

          <img
            src={car.image || "https://via.placeholder.com/400x250"}
            alt={car.name}
            className="carimg2"
            data-aos="zoom-in"
          />

          <div
            className="bs1"
            style={{
              marginTop: 20,
              padding: 25,
            }}
          >

            <h2
              style={{
                color: "#2563eb",
                marginBottom: 15,
              }}
            >
              {car.name}
            </h2>

            <Divider />

            <Row gutter={[15, 15]}>

              <Col span={12}>
                <Tag color="blue" style={{padding:8}}>
                  🚗 {capacity} Seats
                </Tag>
              </Col>

              <Col span={12}>
                <Tag color="green" style={{padding:8}}>
                  ⛽ {fuelType}
                </Tag>
              </Col>

              <Col span={12}>
                <Tag color="gold" style={{padding:8}}>
                  💰 ₹ {rentPerHour}/Hour
                </Tag>
              </Col>

              <Col span={12}>
                <Tag color="purple" style={{padding:8}}>
                  ⭐ Premium
                </Tag>
              </Col>

            </Row>

            <Divider />

            <Row gutter={[15,15]}>

              <Col span={8} style={{textAlign:"center"}}>

                <SafetyCertificateOutlined
                  style={{
                    fontSize:35,
                    color:"#16a34a"
                  }}
                />

                <p>Safe Ride</p>

              </Col>

              <Col span={8} style={{textAlign:"center"}}>

                <ClockCircleOutlined
                  style={{
                    fontSize:35,
                    color:"#2563eb"
                  }}
                />

                <p>24/7 Support</p>

              </Col>

              <Col span={8} style={{textAlign:"center"}}>

                <ThunderboltOutlined
                  style={{
                    fontSize:35,
                    color:"#f97316"
                  }}
                />

                <p>Instant Booking</p>

              </Col>

            </Row>

          </div>

        </Col>

        {/* RIGHT SIDE */}

        <Col lg={11} md={24} sm={24} xs={24}>

          <div
            className="bs1"
            style={{
              padding:30,
            }}
          >

            <h2
              style={{
                color:"#2563eb"
              }}
            >
              <CarOutlined /> Book Your Ride
            </h2>

            <Divider />

            <p
              style={{
                fontWeight:600
              }}
            >
              Select Pickup & Return Time
            </p>

            <RangePicker
              showTime={{ format: "HH:mm" }}
              format="MMM DD YYYY HH:mm"
              style={{ width: "100%" }}
              onChange={selectTimeSlots}
            />

            <button
              className="btn1"
              style={{
                width:"100%",
                marginTop:20
              }}
              onClick={()=>setShowModal(true)}
            >
              View Booked Slots
            </button>

            {from && to && (

              <>

              <Divider />

              <h3
                style={{
                  color:"#2563eb"
                }}
              >
                Booking Summary
              </h3>

              <div className="booking-info">

                <span>Total Hours</span>

                <b>{totalHours}</b>

              </div>

              <div className="booking-info">

                <span>Rent / Hour</span>

                <b>₹ {rentPerHour}</b>

              </div>

              <div className="booking-info">

                <span>Pickup</span>

                <b>{from}</b>

              </div>

              <div className="booking-info">

                <span>Return</span>

                <b>{to}</b>

              </div>

              <Divider />

              <Checkbox
                onChange={(e)=>setdriver(e.target.checked)}
              >
                Need Driver (+₹30/hour)
              </Checkbox>

              <Divider />

              <h2
                style={{
                  color:"#16a34a"
                }}
              >
                <DollarCircleOutlined />

                {" "}₹ {totalAmount}

              </h2>

              <StripeCheckout
                shippingAddress
                token={onToken}
                currency="inr"
                amount={totalAmount*100}
                stripeKey="pk_test_51NFtVGSAZAXtdYSkpJntFLfuU3dQNlk1BVqldJWCWQUyDqAtoE1wHVhRCB2GEnGurggdZOd1L08afXnaMN0H7qcO00yUPQevQp"
              >

                <button
                  className="btn1"
                  style={{
                    width:"100%",
                    marginTop:20,
                    fontSize:18,
                    padding:15
                  }}
                >
                  💳 Proceed To Payment
                </button>

              </StripeCheckout>

              </>

            )}

          </div>

        </Col>

      </Row>

      <Modal
        title="Booked Time Slots"
        open={showModal}
        footer={null}
        onCancel={()=>setShowModal(false)}
      >

        {car.bookedTimeSlots?.length > 0 ? (

          car.bookedTimeSlots.map((slot,index)=>(
            <Tag
              key={index}
              color="red"
              style={{
                marginBottom:10,
                padding:10,
                width:"100%"
              }}
            >
              {slot.from} → {slot.to}
            </Tag>
          ))

        ) : (

          <p>No Bookings Yet</p>

        )}

      </Modal>

    </DefaultLayout>
  );

}

export default BookingCar;