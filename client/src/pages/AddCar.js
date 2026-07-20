import React from "react";
import { Row, Col, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { addCar } from "../redux/actions/carsActions";

function AddCar() {

  const dispatch = useDispatch();
  const alertsReducer = useSelector((state) => state.alertsReducer);

const loading = alertsReducer?.loading || false;

  function onFinish(values) {

    values.bookedTimeSlots = [];

    dispatch(addCar(values));

  }

  return (

    <DefaultLayout>

      {loading && <Spinner />}

      <Row
        justify="center"
        style={{
          padding: "40px 20px",
          background: "#f5f7fb",
          minHeight: "90vh",
        }}
      >

        <Col lg={14} sm={24} xs={24}>

          <div
            className="bs1"
            style={{
              padding: "35px",
              borderRadius: "18px",
              background: "#fff",
            }}
          >

            <h1
              style={{
                color: "#2563eb",
                fontWeight: "700",
                marginBottom: "5px",
              }}
            >
              🚗 Add New Car
            </h1>

            <p
              style={{
                color: "#666",
                marginBottom: "30px",
              }}
            >
              Fill all the car details carefully before submitting.
            </p>

            <Form
              layout="vertical"
              onFinish={onFinish}
            >

              <Row gutter={20}>

                <Col lg={12} xs={24}>

                  <Form.Item
                    name="name"
                    label="Car Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="BMW M4" />
                  </Form.Item>

                </Col>

                <Col lg={12} xs={24}>

                  <Form.Item
                    name="rentPerHour"
                    label="Rent Per Hour (₹)"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="1500" />
                  </Form.Item>

                </Col>

              </Row>

              <Row gutter={20}>

                <Col lg={12} xs={24}>

                  <Form.Item
                    name="capacity"
                    label="Passenger Capacity"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="5" />
                  </Form.Item>

                </Col>

                <Col lg={12} xs={24}>

                  <Form.Item
                    name="fuelType"
                    label="Fuel Type"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Petrol / Diesel / EV" />
                  </Form.Item>

                </Col>

              </Row>

              <Form.Item
                name="image"
                label="Car Image URL"
                rules={[{ required: true }]}
              >
                <Input placeholder="https://image-url.com/car.jpg" />
              </Form.Item>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "30px",
                }}
              >

                <button
                  className="btn1"
                  style={{
                    width: "100%",
                    fontSize: "18px",
                    padding: "12px",
                  }}
                >
                  🚘 ADD CAR
                </button>

              </div>

            </Form>

          </div>

        </Col>

      </Row>

    </DefaultLayout>

  );
}

export default AddCar;