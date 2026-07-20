import React from "react";
import { Row, Col, Button, Avatar, Space } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  CalendarOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  CarOutlined,
} from "@ant-design/icons";

function DefaultLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      {/* Header */}

      <div className="header">
        <Row justify="center">
          <Col xs={23} lg={22}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 15,
              }}
            >
              {/* Logo */}

              <Link
                to="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                <CarOutlined
                  style={{
                    fontSize: 34,
                    color: "#60a5fa",
                    marginRight: 10,
                  }}
                />

                <div>
                  <h2
                    style={{
                      color: "white",
                      margin: 0,
                    }}
                  >
                    DriveEase
                  </h2>

                  <small
                    style={{
                      color: "#cbd5e1",
                    }}
                  >
                    Premium Car Rental
                  </small>
                </div>
              </Link>

              {/* Menu */}

              <Space wrap size="middle">
                <Link to="/">
                  <Button
                    type={
                      location.pathname === "/"
                        ? "primary"
                        : "default"
                    }
                    icon={<HomeOutlined />}
                  >
                    Home
                  </Button>
                </Link>

                <Link to="/userbookings">
                  <Button
                    type={
                      location.pathname === "/userbookings"
                        ? "primary"
                        : "default"
                    }
                    icon={<CalendarOutlined />}
                  >
                    My Bookings
                  </Button>
                </Link>

                {user?.username === "parthpatel79_" && (
                  <Link to="/admin">
                    <Button
                      type={
                        location.pathname === "/admin"
                          ? "primary"
                          : "default"
                      }
                      icon={<DashboardOutlined />}
                    >
                      Admin
                    </Button>
                  </Link>
                )}

                <Avatar
                  icon={<UserOutlined />}
                  size={40}
                />

                <span
                  style={{
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {user?.username}
                </span>

                <Button
                  danger
                  icon={<LogoutOutlined />}
                  onClick={logout}
                >
                  Logout
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </div>

      {/* Main */}

      <div className="content">
        {children}
      </div>

      {/* Footer */}

      <div className="footer">
        <h3>🚗 DriveEase Car Rental</h3>

        <p>Premium Car Rental Management System</p>

        <hr
          style={{
            margin: "20px 0",
            opacity: 0.2,
          }}
        />

        <p>© 2026 All Rights Reserved</p>

        <p>
          Developed by <b>Parth Patel & Darshil Joshi</b>
        </p>
      </div>
    </div>
  );
}

export default DefaultLayout;