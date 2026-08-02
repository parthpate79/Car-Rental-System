import React from "react";

import {
  Button,
  Col,
  Dropdown,
  Row,
  Space,
  Tag,
} from "antd";

import {
  BankOutlined,
  CalendarOutlined,
  CarOutlined,
  DashboardOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  SafetyCertificateOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import ProfileAvatar from "./ProfileAvatar";

function DefaultLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    console.error(
      "Invalid user information:",
      error
    );

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const isAdminArea =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/") ||
    location.pathname === "/addcar" ||
    location.pathname.startsWith("/editcar/");

  // Mobile dropdown menu
  const mobileMenuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },

    {
      key: "bookings",
      icon: <CalendarOutlined />,
      label: (
        <Link to="/userbookings">
          My Bookings
        </Link>
      ),
    },
  ];

  // Normal users see marketplace links
  if (user?.isAdmin !== true) {
    mobileMenuItems.push(
      {
        key: "list-car",
        icon: <PlusCircleOutlined />,
        label: (
          <Link to="/list-your-car">
            List Your Car
          </Link>
        ),
      },
      {
        key: "my-listings",
        icon: <UnorderedListOutlined />,
        label: (
          <Link to="/my-car-listings">
            My Listings
          </Link>
        ),
      },
      {
        key: "owner-earnings",
        icon: <BankOutlined />,
        label: (
          <Link to="/owner-earnings">
            Earnings
          </Link>
        ),
      }
    );
  }

  // Admin gets only one Admin button
  if (user?.isAdmin === true) {
    mobileMenuItems.push({
      key: "admin",
      icon: <DashboardOutlined />,
      label: (
        <Link to="/admin">
          Admin
        </Link>
      ),
    });
  }

  mobileMenuItems.push({
    type: "divider",
  });

  mobileMenuItems.push({
    key: "logout",
    icon: <LogoutOutlined />,
    danger: true,
    label: "Logout",
    onClick: logout,
  });

  return (
    <div className="application-layout">
      {/* Website Header */}
      <header className="modern-header">
        <Row justify="center">
          <Col xs={23} xl={22}>
            <div className="navbar-container">
              {/* Brand */}
              <Link
                to="/"
                className="brand-link"
              >
                <div className="brand-icon">
                  <CarOutlined />
                </div>

                <div className="brand-text">
                  <h2>DriveEase</h2>

                  <span>
                    Premium Car Rental
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="desktop-navigation">
                <Link
                  to="/"
                  className={
                    isActive("/")
                      ? "navigation-link active"
                      : "navigation-link"
                  }
                >
                  <HomeOutlined />
                  Home
                </Link>

                <Link
                  to="/userbookings"
                  className={
                    isActive("/userbookings")
                      ? "navigation-link active"
                      : "navigation-link"
                  }
                >
                  <CalendarOutlined />
                  My Bookings
                </Link>

                {/* Normal user links */}
                {user?.isAdmin !== true && (
                  <>
                    <Link
                      to="/list-your-car"
                      className={
                        isActive("/list-your-car")
                          ? "navigation-link active"
                          : "navigation-link"
                      }
                    >
                      <PlusCircleOutlined />
                      List Your Car
                    </Link>

                    <Link
                      to="/my-car-listings"
                      className={
                        isActive("/my-car-listings")
                          ? "navigation-link active"
                          : "navigation-link"
                      }
                    >
                      <UnorderedListOutlined />
                      My Listings
                    </Link>

                    <Link
                      to="/owner-earnings"
                      className={
                        isActive("/owner-earnings")
                          ? "navigation-link active"
                          : "navigation-link"
                      }
                    >
                      <BankOutlined />
                      Earnings
                    </Link>
                  </>
                )}

                {/* Admin: only one direct button */}
                {user?.isAdmin === true && (
                  <Link
                    to="/admin"
                    className={
                      isAdminArea
                        ? "navigation-link active"
                        : "navigation-link"
                    }
                  >
                    <DashboardOutlined />
                    Admin
                  </Link>
                )}
              </nav>

              {/* Account Area */}
              <div className="user-navigation">
                {user?.isAdmin === true && (
                  <Tag
                    color="blue"
                    className="admin-role-tag"
                  >
                    Administrator
                  </Tag>
                )}

                <ProfileAvatar
                  size={44}
                  editable={true}
                  className="user-avatar"
                />

                <div className="user-information">
                  <small>Welcome</small>

                  <strong>
                    {user?.username || "User"}
                  </strong>
                </div>

                <Button
                  className="desktop-logout-button"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={logout}
                >
                  Logout
                </Button>

                {/* Mobile menu */}
                <Dropdown
                  menu={{
                    items: mobileMenuItems,
                  }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Button
                    className="mobile-menu-button"
                    icon={<MenuOutlined />}
                  />
                </Dropdown>
              </div>
            </div>
          </Col>
        </Row>
      </header>

      {/* Website Content */}
      <main className="main-content">
        <Row justify="center">
          <Col xs={23} xl={22}>
            {children}
          </Col>
        </Row>
      </main>

      {/* Website Footer */}
      <footer className="modern-footer">
        <Row justify="center">
          <Col xs={23} xl={22}>
            <Row gutter={[40, 30]}>
              <Col
                lg={8}
                md={12}
                xs={24}
              >
                <div className="footer-brand">
                  <div className="brand-icon">
                    <CarOutlined />
                  </div>

                  <div>
                    <h2>DriveEase</h2>
                    <p>Premium Car Rental</p>
                  </div>
                </div>

                <p className="footer-description">
                  A modern MERN Stack car rental
                  marketplace providing secure
                  bookings, owner listings and
                  verified vehicles.
                </p>
              </Col>

              <Col
                lg={5}
                md={12}
                xs={24}
              >
                <h3>Quick Links</h3>

                <Space
                  direction="vertical"
                  size="middle"
                >
                  <Link to="/">
                    Available Cars
                  </Link>

                  <Link to="/userbookings">
                    My Bookings
                  </Link>

                  {user?.isAdmin !== true && (
                    <>
                      <Link to="/list-your-car">
                        List Your Car
                      </Link>

                      <Link to="/my-car-listings">
                        My Listings
                      </Link>

                      <Link to="/owner-earnings">
                        Owner Earnings
                      </Link>
                    </>
                  )}

                  {user?.isAdmin === true && (
                    <Link to="/admin">
                      Admin Dashboard
                    </Link>
                  )}
                </Space>
              </Col>

              <Col
                lg={5}
                md={12}
                xs={24}
              >
                <h3>Platform</h3>

                <Space
                  direction="vertical"
                  size="middle"
                >
                  <span>
                    <SafetyCertificateOutlined />{" "}
                    Secure Booking
                  </span>

                  <span>
                    <CarOutlined />{" "}
                    Premium Vehicles
                  </span>

                  <span>
                    <CalendarOutlined />{" "}
                    Flexible Rentals
                  </span>

                  <span>
                    <PlusCircleOutlined />{" "}
                    Owner Marketplace
                  </span>
                </Space>
              </Col>

              <Col
                lg={6}
                md={12}
                xs={24}
              >
                <h3>
                  Project Information
                </h3>

                <p>
                  Built using React, Redux,
                  Node.js, Express.js and
                  MongoDB.
                </p>

                <p>
                  Developed by{" "}
                  <strong>
                    Parth Patel
                  </strong>
                </p>
              </Col>
            </Row>

            <div className="footer-bottom">
              <span>
                © 2026 DriveEase. All rights
                reserved.
              </span>

              <span>
                MERN Stack Car Rental
                Marketplace
              </span>
            </div>
          </Col>
        </Row>
      </footer>
    </div>
  );
}

export default DefaultLayout;