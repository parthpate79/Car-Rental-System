import React, { useState } from "react";
import { Form, Input, message, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://car-rental-system-dkt6.onrender.com/api/users/register",
        {
          username: values.username,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Register response:", response.data);

      message.success("Registration successful");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Server response:", error.response?.data);

      message.error(
        error.response?.data?.message ||
          "Registration failed. Check server connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e40af)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Spin spinning={loading} size="large">
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            background: "#fff",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 15px 40px rgba(0,0,0,.3)",
          }}
        >
          <div className="row g-0">
            <div className="col-lg-6 d-none d-lg-block">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
                alt="Car"
                style={{
                  width: "100%",
                  height: "650px",
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="col-lg-6">
              <div style={{ padding: "50px" }}>
                <h1
                  style={{
                    textAlign: "center",
                    color: "#1e40af",
                    marginBottom: "30px",
                  }}
                >
                  Create Account
                </h1>

                <Form layout="vertical" onFinish={onFinish}>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please enter username",
                      },
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter password",
                      },
                      {
                        min: 4,
                        message: "Password must contain at least 4 characters",
                      },
                    ]}
                  >
                    <Input.Password size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password"
                    name="cpassword"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("password") === value
                          ) {
                            return Promise.resolve();
                          }

                          return Promise.reject(
                            new Error("Passwords do not match")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password size="large" />
                  </Form.Item>

                  <button
                    type="submit"
                    className="btn1"
                    disabled={loading}
                    style={{
                      width: "100%",
                      height: "45px",
                      marginTop: "10px",
                    }}
                  >
                    {loading ? "REGISTERING..." : "REGISTER"}
                  </button>

                  <br />
                  <br />

                  <div style={{ textAlign: "center" }}>
                    Already have an account?
                    <br />
                    <Link to="/login">Login Here</Link>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
}

export default Register;