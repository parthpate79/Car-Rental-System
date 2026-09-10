import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import FileUploader from "../components/FileUploader";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Steps,
  Typography,
} from "antd";

import {
  CarOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  FileProtectOutlined,
  MailOutlined,
  PhoneOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";

import {
  getMyCarListings,
  resubmitCarListing,
  submitCarListing,
} from "../redux/actions/listingActions";

const {
  Title,
  Text,
  Paragraph,
} = Typography;

const { TextArea } = Input;

const currentYear = new Date().getFullYear();

function ListYourCar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { requestId } = useParams();

  const isEditMode = Boolean(requestId);

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading || false
  );

  const myListings = useSelector(
    (state) =>
      state.listingReducer?.myListings || []
  );

  const [form] = Form.useForm();

  const [currentStep, setCurrentStep] =
    useState(0);

  const [pageLoading, setPageLoading] =
    useState(isEditMode);

  const [editingListing, setEditingListing] =
    useState(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      return null;
    }
  }, []);

  const stepFields = [
    [
      "fullName",
      "email",
      "phone",
      "address",
    ],

    [
      "carName",
      "brand",
      "model",
      "manufacturingYear",
      "registrationNumber",
      "fuelType",
      "transmission",
      "capacity",
      "rentPerHour",
      "location",
      "description",
    ],

    [
      "primaryImage",
      "secondImage",
      "thirdImage",
      "rcDocument",
      "insuranceDocument",
      "pucDocument",
      "ownerIdDocument",
    ],
  ];

  useEffect(() => {
    const loadEditListing = async () => {
      if (!isEditMode) {
        setPageLoading(false);
        return;
      }

      let listings = myListings;

      if (listings.length === 0) {
        listings = await dispatch(
          getMyCarListings()
        );
      }

      const selectedListing =
        listings.find(
          (listing) =>
            listing._id === requestId
        );

      if (!selectedListing) {
        setEditingListing(null);
        setPageLoading(false);
        return;
      }

      const editableStatuses = [
        "rejected",
        "changes_requested",
      ];

      if (
        !editableStatuses.includes(
          selectedListing.status
        )
      ) {
        setEditingListing(null);
        setPageLoading(false);
        return;
      }

      setEditingListing(selectedListing);

      form.setFieldsValue({
        fullName:
          selectedListing.ownerDetails
            ?.fullName || "",

        email:
          selectedListing.ownerDetails
            ?.email || "",

        phone:
          selectedListing.ownerDetails
            ?.phone || "",

        address:
          selectedListing.ownerDetails
            ?.address || "",

        carName:
          selectedListing.carDetails
            ?.name || "",

        brand:
          selectedListing.carDetails
            ?.brand || "",

        model:
          selectedListing.carDetails
            ?.model || "",

        manufacturingYear:
          selectedListing.carDetails
            ?.manufacturingYear,

        registrationNumber:
          selectedListing.carDetails
            ?.registrationNumber || "",

        fuelType:
          selectedListing.carDetails
            ?.fuelType || "Petrol",

        transmission:
          selectedListing.carDetails
            ?.transmission || "Manual",

        capacity:
          selectedListing.carDetails
            ?.capacity || 5,

        rentPerHour:
          selectedListing.carDetails
            ?.rentPerHour,

        location:
          selectedListing.carDetails
            ?.location || "Ahmedabad",

        description:
          selectedListing.carDetails
            ?.description || "",

        primaryImage:
          selectedListing.carImages?.[0] || "",

        secondImage:
          selectedListing.carImages?.[1] || "",

        thirdImage:
          selectedListing.carImages?.[2] || "",

        rcDocument:
          selectedListing.documents
            ?.rcDocument || "",

        insuranceDocument:
          selectedListing.documents
            ?.insuranceDocument || "",

        pucDocument:
          selectedListing.documents
            ?.pucDocument || "",

        ownerIdDocument:
          selectedListing.documents
            ?.ownerIdDocument || "",
      });

      setPageLoading(false);
    };

    loadEditListing();
  }, [
    dispatch,
    form,
    isEditMode,
    requestId,
    myListings,
  ]);

  const nextStep = async () => {
    try {
      await form.validateFields(
        stepFields[currentStep]
      );

      setCurrentStep((previous) =>
        Math.min(previous + 1, 2)
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      // Ant Design displays validation errors.
    }
  };

  const previousStep = () => {
    setCurrentStep((previous) =>
      Math.max(previous - 1, 0)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const createRequestData = (values) => {
    const carImages = [
      values.primaryImage,
      values.secondImage,
      values.thirdImage,
    ].filter(Boolean);

    return {
      ownerDetails: {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
      },

      carDetails: {
        name: values.carName.trim(),
        brand: values.brand.trim(),
        model: values.model.trim(),

        manufacturingYear:
          values.manufacturingYear,

        registrationNumber:
          values.registrationNumber
            .trim()
            .toUpperCase(),

        fuelType: values.fuelType,
        transmission: values.transmission,
        capacity: values.capacity,
        rentPerHour: values.rentPerHour,
        location: values.location.trim(),

        description:
          values.description?.trim() || "",
      },

      carImages,

      documents: {
        rcDocument:
          values.rcDocument.trim(),

        insuranceDocument:
          values.insuranceDocument.trim(),

        pucDocument:
          values.pucDocument.trim(),

        ownerIdDocument:
          values.ownerIdDocument.trim(),
      },
    };
  };

  const handleSubmit = async (values) => {
    const requestData =
      createRequestData(values);

    let result = null;

    if (isEditMode && editingListing) {
      result = await dispatch(
        resubmitCarListing(
          editingListing._id,
          requestData
        )
      );
    } else {
      result = await dispatch(
        submitCarListing(requestData)
      );
    }

    if (result) {
      form.resetFields();

      setTimeout(() => {
        navigate("/my-car-listings");
      }, 600);
    }
  };

  if (pageLoading) {
    return (
      <DefaultLayout>
        <div className="booking-success-loading">
          <Spin size="large" />
        </div>
      </DefaultLayout>
    );
  }

  if (isEditMode && !editingListing) {
    return (
      <DefaultLayout>
        <Card className="my-listings-empty">
          <Empty
            description="This listing cannot be edited"
          >
            <Link to="/my-car-listings">
              <Button type="primary">
                Return to My Listings
              </Button>
            </Link>
          </Empty>
        </Card>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <section className="list-car-page">
        <div className="list-car-hero">
          <div className="list-car-hero-content">
            <Text className="list-car-label">
              {isEditMode
                ? "UPDATE YOUR CAR REQUEST"
                : "BECOME A DRIVEEASE HOST"}
            </Text>

            <Title>
              {isEditMode
                ? "Correct and resubmit your listing"
                : "Turn your car into an earning asset"}
            </Title>

            <Paragraph
  style={{
    color: "#dbeafe",
    opacity: 1,
    fontSize: "15px",
    lineHeight: 1.7,
    marginBottom: 0,
  }}
>
  Submit your vehicle for verification. After admin approval,
  your car will be published on DriveEase and customers will
  be able to book it.
</Paragraph>

            <div className="list-car-benefits">
              <span>
                <CheckCircleOutlined />
                Verified customers
              </span>

              <span>
                <CheckCircleOutlined />
                Flexible rental pricing
              </span>

              <span>
                <CheckCircleOutlined />
                Transparent commission
              </span>
            </div>
          </div>

          <div className="list-car-earning-card">
            <CarOutlined />

            <Text>
              {isEditMode
                ? "Current Request Status"
                : "Potential Monthly Earnings"}
            </Text>

            <Title level={2}>
              {isEditMode
                ? editingListing?.status ===
                  "rejected"
                  ? "Rejected"
                  : "Changes Required"
                : "₹20,000+"}
            </Title>

            <Paragraph>
              {isEditMode
                ? "Update the requested information before resubmitting."
                : "Earnings depend on rent, booking duration and vehicle availability."}
            </Paragraph>
          </div>
        </div>

        {isEditMode &&
          editingListing?.adminRemark && (
            <Alert
              type={
                editingListing.status ===
                "rejected"
                  ? "error"
                  : "warning"
              }
              showIcon
              className="listing-document-alert"
              message="Admin Feedback"
              description={
                editingListing.adminRemark
              }
            />
          )}

        <Card
          bordered={false}
          className="list-car-form-card"
        >
          <Steps
            current={currentStep}
            className="listing-form-steps"
            items={[
              {
                title: "Owner Details",
                icon: <UserOutlined />,
              },
              {
                title: "Car Details",
                icon: <CarOutlined />,
              },
              {
                title: "Images & Documents",
                icon: <FileProtectOutlined />,
              },
            ]}
          />

          <Divider />

          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleSubmit}
            initialValues={{
              fuelType: "Petrol",
              transmission: "Manual",
              capacity: 5,
              location: "Ahmedabad",
              fullName: user?.username || "",
            }}
          >
            <div
              style={{
                display:
                  currentStep === 0
                    ? "block"
                    : "none",
              }}
            >
              <div className="listing-section-heading">
                <UserOutlined />

                <div>
                  <Title level={3}>
                    Owner Information
                  </Title>

                  <Text type="secondary">
                    Enter the vehicle owner’s contact
                    and identity details.
                  </Text>
                </div>
              </div>

              <Row gutter={[20, 4]}>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please enter the owner name",
                      },
                      {
                        min: 3,
                        message:
                          "Name must contain at least 3 characters",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Owner full name"
                    />
                  </Form.Item>
                </Col>

                <Col md={12} xs={24}>
                  <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please enter an email address",
                      },
                      {
                        type: "email",
                        message:
                          "Please enter a valid email address",
                      },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="owner@example.com"
                    />
                  </Form.Item>
                </Col>

                <Col md={12} xs={24}>
                  <Form.Item
                    label="Phone Number"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please enter a phone number",
                      },
                      {
                        pattern: /^[6-9]\d{9}$/,
                        message:
                          "Enter a valid 10-digit Indian mobile number",
                      },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </Form.Item>
                </Col>

                <Col md={12} xs={24}>
                  <Form.Item
                    label="Complete Address"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please enter the owner address",
                      },
                    ]}
                  >
                    <Input
                      prefix={<EnvironmentOutlined />}
                      placeholder="Complete residential address"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div
              style={{
                display:
                  currentStep === 1
                    ? "block"
                    : "none",
              }}
            >
              <div className="listing-section-heading">
                <CarOutlined />

                <div>
                  <Title level={3}>
                    Vehicle Information
                  </Title>

                  <Text type="secondary">
                    Update the vehicle details requested
                    by the administrator.
                  </Text>
                </div>
              </div>

              <Row gutter={[20, 4]}>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Car Listing Name"
                    name="carName"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please enter the car name",
                      },
                    ]}
                  >
                    <Input placeholder="Example: Hyundai Creta SX" />
                  </Form.Item>
                </Col>

                <Col md={6} xs={24}>
                  <Form.Item
                    label="Brand"
                    name="brand"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please enter the brand",
                      },
                    ]}
                  >
                    <Input placeholder="Hyundai" />
                  </Form.Item>
                </Col>

                <Col md={6} xs={24}>
                  <Form.Item
                    label="Model"
                    name="model"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please enter the model",
                      },
                    ]}
                  >
                    <Input placeholder="Creta SX" />
                  </Form.Item>
                </Col>

                <Col md={8} xs={24}>
                  <Form.Item
                    label="Manufacturing Year"
                    name="manufacturingYear"
                    rules={[
                      {
                        required: true,
                        message:
                          "Enter manufacturing year",
                      },
                    ]}
                  >
                    <InputNumber
                      min={2000}
                      max={currentYear}
                      className="full-width-control"
                    />
                  </Form.Item>
                </Col>

                <Col md={8} xs={24}>
                  <Form.Item
                    label="Registration Number"
                    name="registrationNumber"
                    rules={[
                      {
                        required: true,
                        message:
                          "Enter registration number",
                      },
                      {
                        pattern:
                          /^[A-Za-z]{2}[0-9]{1,2}[A-Za-z]{1,3}[0-9]{4}$/,
                        message:
                          "Example format: GJ01AB1234",
                      },
                    ]}
                  >
                    <Input
                      placeholder="GJ01AB1234"
                      style={{
                        textTransform: "uppercase",
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col md={8} xs={24}>
                  <Form.Item
                    label="Location"
                    name="location"
                    rules={[
                      {
                        required: true,
                        message:
                          "Enter vehicle location",
                      },
                    ]}
                  >
                    <Input
                      prefix={<EnvironmentOutlined />}
                      placeholder="Ahmedabad"
                    />
                  </Form.Item>
                </Col>

                <Col md={6} xs={24}>
                  <Form.Item
                    label="Fuel Type"
                    name="fuelType"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={[
                        {
                          label: "Petrol",
                          value: "Petrol",
                        },
                        {
                          label: "Diesel",
                          value: "Diesel",
                        },
                        {
                          label: "Electric",
                          value: "Electric",
                        },
                        {
                          label: "CNG",
                          value: "CNG",
                        },
                        {
                          label: "Hybrid",
                          value: "Hybrid",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col md={6} xs={24}>
                  <Form.Item
                    label="Transmission"
                    name="transmission"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={[
                        {
                          label: "Manual",
                          value: "Manual",
                        },
                        {
                          label: "Automatic",
                          value: "Automatic",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col md={6} xs={24}>
                  <Form.Item
                    label="Seating Capacity"
                    name="capacity"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={1}
                      max={20}
                      className="full-width-control"
                    />
                  </Form.Item>
                </Col>

                <Col md={6} xs={24}>
                  <Form.Item
                    label="Requested Rent / Hour"
                    name="rentPerHour"
                    rules={[
                      {
                        required: true,
                        message:
                          "Enter rent per hour",
                      },
                    ]}
                  >
                    <InputNumber
                      min={100}
                      max={100000}
                      prefix="₹"
                      className="full-width-control"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Vehicle Description"
                    name="description"
                  >
                    <TextArea
                      rows={5}
                      maxLength={1000}
                      showCount
                      placeholder="Condition, features and vehicle details..."
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div
              style={{
                display:
                  currentStep === 2
                    ? "block"
                    : "none",
              }}
            >
              <div className="listing-section-heading">
                <FileProtectOutlined />

                <div>
                  <Title level={3}>
  Images and Documents
</Title>

<Text type="secondary">
  Upload images and documents directly from your device.
</Text>

</div>
</div>

<Alert
  type="info"
  showIcon
  className="listing-document-alert"
  message="Document Privacy"
  description="Upload your car images and required documents. URLs are not required anymore."
/>

<Row gutter={[20, 20]}>

  <Col md={12} xs={24}>
    <Form.Item
      name="primaryImage"
      rules={[
        {
          required: true,
          message: "Upload Primary Image",
        },
      ]}
    >
      <FileUploader
        form={form}
        fieldName="primaryImage"
        label="Primary Car Image"
      />
    </Form.Item>
  </Col>

  <Col md={12} xs={24}>
    <Form.Item name="secondImage">
      <FileUploader
        form={form}
        fieldName="secondImage"
        label="Second Car Image"
      />
    </Form.Item>
  </Col>

  <Col md={12} xs={24}>
    <Form.Item name="thirdImage">
      <FileUploader
        form={form}
        fieldName="thirdImage"
        label="Third Car Image"
      />
    </Form.Item>
  </Col>

  <Col md={12} xs={24}>
    <Form.Item
      name="rcDocument"
      rules={[
        {
          required: true,
          message: "Upload RC Document",
        },
      ]}
    >
      <FileUploader
        form={form}
        fieldName="rcDocument"
        label="RC Document"
        isDocument={true}
      />
    </Form.Item>
  </Col>

  <Col md={12} xs={24}>
    <Form.Item
      name="insuranceDocument"
      rules={[
        {
          required: true,
          message: "Upload Insurance Document",
        },
      ]}
    >
      <FileUploader
        form={form}
        fieldName="insuranceDocument"
        label="Insurance Document"
        isDocument={true}
      />
    </Form.Item>
  </Col>

  <Col md={12} xs={24}>
    <Form.Item
      name="pucDocument"
      rules={[
        {
          required: true,
          message: "Upload PUC Document",
        },
      ]}
    >
      <FileUploader
        form={form}
        fieldName="pucDocument"
        label="PUC Document"
        isDocument={true}
      />
    </Form.Item>
  </Col>

  <Col md={12} xs={24}>
    <Form.Item
      name="ownerIdDocument"
      rules={[
        {
          required: true,
          message: "Upload Owner ID",
        },
      ]}
    >
      <FileUploader
        form={form}
        fieldName="ownerIdDocument"
        label="Owner ID"
        isDocument={true}
      />
    </Form.Item>
  </Col>

</Row>

</div>

<Divider />

            <div className="listing-form-actions">
              <div>
                <Link to="/my-car-listings">
                  <Button>
                    Cancel and Return
                  </Button>
                </Link>
              </div>

              <Space wrap>
                {currentStep > 0 && (
                  <Button onClick={previousStep}>
                    Previous
                  </Button>
                )}

                {currentStep < 2 ? (
                  <Button
                    type="primary"
                    onClick={nextStep}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SendOutlined />}
                  >
                    {isEditMode
                      ? "Resubmit for Verification"
                      : "Submit for Verification"}
                  </Button>
                )}
              </Space>
            </div>
          </Form>
        </Card>
      </section>
    </DefaultLayout>
  );
}

export default ListYourCar;