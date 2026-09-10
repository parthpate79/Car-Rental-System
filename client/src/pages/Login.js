import { safeReturnPath } from "../utils/rental";
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

import { userLogin } from "../redux/actions/userActions";
import Spinner from "../components/Spinner";

import "./Auth.css";

const {
  Title,
  Text,
  Paragraph,
} = Typography;

function Login() {
  const dispatch = useDispatch();

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading || false
  );

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    return <Navigate to={safeReturnPath(new URLSearchParams(window.location.search).get("next"))} replace />;
  }

  const onFinish = (values) => {
    dispatch(
      userLogin({
        username: values.username.trim(),
        password: values.password,
      })
    );
  };

  return (
    <main className="auth-page"><Link to="/" className="auth-browse-link">← Explore cars without signing in</Link>
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
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600"
                alt="Premium sports car"
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
                  <ThunderboltOutlined />
                  Fast. Secure. Premium.
                </div>

                <Title>
                  Your perfect journey starts here.
                </Title>

                <Paragraph>
                  Explore rental vehicles, flexible
                  booking periods and a smooth rental
                  experience from one secure platform.
                </Paragraph>

                <div className="auth-feature-list">
                  <span>
                    <CheckCircleOutlined />
                    Cars for different journeys
                  </span>

                  <span>
                    <SafetyCertificateOutlined />
                    Secure booking experience
                  </span>

                  <span>
                    <ThunderboltOutlined />
                    Fast and simple reservations
                  </span>
                </div>
              </div>

              <div className="auth-visual-footer">
                <span>Trusted rental experience</span>
                <span>24/7 support</span>
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
                  WELCOME BACK
                </Text>

                <Title>
                  Login to your account
                </Title>

                <Paragraph>
                  Access your bookings, manage trips and
                  explore premium rental vehicles.
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
                        "Please enter your username",
                    },
                    {
                      min: 3,
                      message:
                        "Username must contain at least 3 characters",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your username"
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
                        "Please enter your password",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </Form.Item>

                <div className="auth-form-options">
                  <Text type="secondary">
                    Secure account access
                  </Text>

                  <span>
                    <SafetyCertificateOutlined />
                    Protected
                  </span>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="auth-submit-button"
                >
                  <span>Login</span>
                  <ArrowRightOutlined />
                </Button>

                <div className="auth-divider">
                  <span>New to DriveEase?</span>
                </div>

                <Link
                  to={`/register${window.location.search}`}
                  className="auth-secondary-link"
                >
                  Create a new account
                </Link>
              </Form>

              <div className="auth-form-footer">
                By continuing, you agree to use DriveEase
                responsibly and securely.
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </main>
  );
}

export default Login;