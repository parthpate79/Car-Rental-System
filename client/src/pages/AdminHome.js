import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { deleteCar, getAllCars } from "../redux/actions/carsActions";
import { Row, Col, Popconfirm } from "antd";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  CarOutlined,
} from "@ant-design/icons";

function AdminHome() {
  const user = JSON.parse(localStorage.getItem("user"));

  // Only Owner
  if (user.username !== "parthpatel79_") {
    window.location.href = "/";
  }

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

  return (
    <DefaultLayout>

      {loading && <Spinner />}

      {/* Top Banner */}

      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#4f46e5)",
          padding: "35px",
          borderRadius: "20px",
          color: "white",
          marginBottom: "30px",
        }}
      >
        <Row justify="space-between" align="middle">

          <Col>

            <h1
              style={{
                color: "white",
                marginBottom: "10px",
              }}
            >
              🚗 Admin Dashboard
            </h1>

            <p
              style={{
                color: "white",
                opacity: ".9",
                fontSize: "17px",
              }}
            >
              Manage Cars • Edit Cars • Delete Cars
            </p>

          </Col>

          <Col>

            <Link to="/addcar">

              <button
                className="btn1"
                style={{
                  background: "white",
                  color: "#2563eb",
                  fontWeight: "700",
                }}
              >
                <PlusCircleOutlined /> Add New Car
              </button>

            </Link>

          </Col>

        </Row>
      </div>

      {/* Stats */}

      <Row gutter={20} style={{ marginBottom: "25px" }}>

        <Col lg={8} xs={24}>

          <div
            className="bs1"
            style={{
              padding: "25px",
              textAlign: "center",
            }}
          >
            <CarOutlined
              style={{
                fontSize: "45px",
                color: "#2563eb",
              }}
            />

            <h2 style={{ marginTop: "15px" }}>{totalCars.length}</h2>

            <p>Total Cars</p>

          </div>

        </Col>

        <Col lg={8} xs={24}>

          <div
            className="bs1"
            style={{
              padding: "25px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#16a34a" }}>Available</h2>

            <h1>{totalCars.length}</h1>

          </div>

        </Col>

        <Col lg={8} xs={24}>

          <div
            className="bs1"
            style={{
              padding: "25px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#f97316" }}>Owner</h2>

            <h4>{user.username}</h4>

          </div>

        </Col>

      </Row>

      {/* Cars */}

      <Row gutter={[24, 24]}>

        {Array.isArray(totalCars) &&
totalCars.map((car) => (

          <Col lg={6} md={8} sm={12} xs={24} key={car._id}>

            <div
              className="bs1"
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                transition: ".35s",
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

              <div style={{ padding: "18px" }}>

                <h3>{car.name}</h3>

                <p>
                  💰 ₹{car.rentPerHour} / Hour
                </p>

                <p>
                  ⛽ {car.fuelType || "-"}
                </p>

                <p>
                  👥 {car.capacity || "-"} Seats
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "15px",
                  }}
                >

                  <Link to={`/editcar/${car._id}`}>

                    <button
                      className="btn1"
                      style={{
                        background: "#16a34a",
                      }}
                    >
                      <EditOutlined /> Edit
                    </button>

                  </Link>

                  <Popconfirm
                    title="Delete this Car?"
                    okText="Delete"
                    cancelText="Cancel"
                    onConfirm={() =>
                      dispatch(deleteCar({ carid: car._id }))
                    }
                  >
                    <button
                      className="btn1"
                      style={{
                        background: "#dc2626",
                      }}
                    >
                      <DeleteOutlined /> Delete
                    </button>
                  </Popconfirm>

                </div>

              </div>

            </div>

          </Col>

        ))}

      </Row>

    </DefaultLayout>
  );
}

export default AdminHome;