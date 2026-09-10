import React from "react";

import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Typography,
} from "antd";

import {
  ArrowRightOutlined,
  CarOutlined,
  CheckCircleOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Link,
  Navigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { userRegister } from "../redux/actions/userActions";
import Spinner from "../components/Spinner";

import "./Auth.css";

const {
  Title,
  Text,
  Paragraph,
} = Typography;

function Register() {
  const dispatch = useDispatch();

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading || false
  );

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    return <Navigate to="/" replace />;
  }

  const onFinish = (values) => {
    dispatch(
      userRegister({
        username: values.username.trim(),
        password: values.password,
      })
    );
  };

  return (
    <main className="auth-page auth-register-page">
      {loading && <Spinner />}

      <div className="auth-background-shape auth-shape-one" />
      <div className="auth-background-shape auth-shape-two" />

      <section className="auth-container">
        <Row className="auth-row">
          <Col
            lg={13}
            xs={0}
            className="auth-visual-column"
          >
            <div className="auth-visual">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600"
                alt="Premium rental vehicle"
              />

              <div className="auth-visual-overlay" />

              <div className="auth-brand">
                <div className="auth-brand-icon">
                  <CarOutlined />
                </div>

                <div>
                  <strong>DriveEase</strong>
                  <span>Premium Car Rental</span>
                </div>
              </div>

              <div className="auth-visual-content">
                <div className="auth-eyebrow">
                  <UserAddOutlined />
                  Join the DriveEase community
                </div>

                <Title>
                  Create your account and start exploring.
                </Title>

                <Paragraph>
                  Book premium vehicles, manage every trip
                  and even list your own car on the
                  DriveEase marketplace.
                </Paragraph>

                <div className="auth-feature-list">
                  <span>
                    <CheckCircleOutlined />
                    Book verified rental cars
                  </span>

                  <span>
                    <SafetyCertificateOutlined />
                    Secure account and booking flow
                  </span>

                  <span>
                    <ThunderboltOutlined />
                    Quick registration process
                  </span>
                </div>
              </div>

              <div className="auth-visual-footer">
                <span>Premium mobility</span>
                <span>Simple account setup</span>
              </div>
            </div>
          </Col>

          <Col
            lg={11}
            xs={24}
            className="auth-form-column"
          >
            <div className="auth-form-panel">
              <div className="auth-mobile-brand">
                <div className="auth-brand-icon">
                  <CarOutlined />
                </div>

                <div>
                  <strong>DriveEase</strong>
                  <span>Premium Car Rental</span>
                </div>
              </div>

              <div className="auth-form-heading">
                <Text className="auth-form-label">
                  CREATE YOUR ACCOUNT
                </Text>

                <Title>
                  Join DriveEase today
                </Title>

                <Paragraph>
                  Create your account and access the
                  complete premium rental experience.
                </Paragraph>
              </div>

              <Form
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                size="large"
                className="auth-form"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter a username",
                    },
                    {
                      min: 3,
                      message:
                        "Username must contain at least 3 characters",
                    },
                    {
                      max: 30,
                      message:
                        "Username cannot exceed 30 characters",
                    },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message:
                        "Use only letters, numbers and underscores",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Choose a username"
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter a password",
                    },
                    {
                      min: 8,
                      message:
                        "Password must contain at least 8 characters",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                  />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message:
                        "Please confirm your password",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          !value ||
                          getFieldValue("password") ===
                            value
                        ) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(
                            "Passwords do not match"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                  />
                </Form.Item>

                <div className="auth-password-hint">
                  <CheckCircleOutlined />
                  Use at least 8 characters for better
                  account security.
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="auth-submit-button"
                >
                  <span>Create Account</span>
                  <ArrowRightOutlined />
                </Button>

                <div className="auth-divider">
                  <span>Already registered?</span>
                </div>

                <Link
                  to={`/login${window.location.search}`}
                  className="auth-secondary-link"
                >
                  Login to your account
                </Link>
              </Form>

              <div className="auth-form-footer">
                Your account information is protected and
                used only for the DriveEase platform.
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </main>
  );
}

export default Register;