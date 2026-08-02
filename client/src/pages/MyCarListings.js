import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Tag,
  Typography,
} from "antd";

import {
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FileSearchOutlined,
  PlusCircleOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { Link } from "react-router-dom";

import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";

import {
  getMyCarListings,
} from "../redux/actions/listingActions";

import "./MyCarListings.css";

const {
  Title,
  Text,
  Paragraph,
} = Typography;

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString(
    "en-IN"
  );

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const getStatusDetails = (status) => {
  switch (status) {
    case "approved":
      return {
        color: "green",
        label: "Approved",
        icon: <CheckCircleOutlined />,
      };

    case "rejected":
      return {
        color: "red",
        label: "Rejected",
        icon: <CloseCircleOutlined />,
      };

    case "changes_requested":
      return {
        color: "orange",
        label: "Changes Required",
        icon: <SyncOutlined />,
      };

    default:
      return {
        color: "blue",
        label: "Pending Review",
        icon: <ClockCircleOutlined />,
      };
  }
};

const getDisplayName = (listing) => {
  const name =
    listing.carDetails?.name?.trim();

  const fallbackName = [
    listing.carDetails?.brand,
    listing.carDetails?.model,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (
    !name ||
    name.startsWith("http://") ||
    name.startsWith("https://")
  ) {
    return (
      fallbackName ||
      "DriveEase Rental Car"
    );
  }

  return name;
};

function MyCarListings() {
  const dispatch = useDispatch();

  const listings = useSelector(
    (state) =>
      state.listingReducer
        ?.myListings || []
  );

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading ||
      false
  );

  useEffect(() => {
    dispatch(getMyCarListings());
  }, [dispatch]);

  const statistics = useMemo(() => {
    return {
      total: listings.length,

      pending: listings.filter(
        (item) =>
          item.status === "pending"
      ).length,

      approved: listings.filter(
        (item) =>
          item.status === "approved"
      ).length,

      actionRequired:
        listings.filter((item) =>
          [
            "rejected",
            "changes_requested",
          ].includes(item.status)
        ).length,
    };
  }, [listings]);

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <section className="owner-dashboard-page">
        <div className="owner-dashboard-hero">
          <div className="owner-dashboard-hero-main">
            <Text className="owner-dashboard-label">
              <CarOutlined />
              HOST DASHBOARD
            </Text>

            <Title level={1}>
              My Car Listings
            </Title>

            <Paragraph>
              Track verification status, admin
              feedback and approved vehicles from
              one convenient dashboard.
            </Paragraph>
          </div>

          <div className="owner-dashboard-hero-info">
            <div className="owner-hero-info-card">
              <SafetyCertificateOutlined />

              <div>
                <strong>
                  Verified Marketplace
                </strong>

                <span>
                  Secure listing review process
                </span>
              </div>
            </div>

            <div className="owner-hero-info-card">
              <CheckCircleOutlined />

              <div>
                <strong>
                  {statistics.approved} Cars Live
                </strong>

                <span>
                  Published on DriveEase
                </span>
              </div>
            </div>

            <div className="owner-hero-info-card">
              <RiseOutlined />

              <div>
                <strong>
                  Grow Your Earnings
                </strong>

                <span>
                  Reach more rental customers
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/list-your-car"
            className="owner-list-another-link"
          >
            <Button
              type="primary"
              size="large"
              icon={<PlusCircleOutlined />}
              className="owner-list-another-button"
            >
              List Another Car
            </Button>
          </Link>
        </div>

        <Row
          gutter={[18, 18]}
          className="owner-statistics-row"
        >
          <Col
            xl={6}
            md={12}
            xs={24}
          >
            <Card
              bordered={false}
              className="owner-statistic-card"
            >
              <span className="owner-statistic-icon blue">
                <FileSearchOutlined />
              </span>

              <div>
                <Text>
                  Total Requests
                </Text>

                <Title level={2}>
                  {statistics.total}
                </Title>

                <small>
                  All-time requests
                </small>
              </div>
            </Card>
          </Col>

          <Col
            xl={6}
            md={12}
            xs={24}
          >
            <Card
              bordered={false}
              className="owner-statistic-card"
            >
              <span className="owner-statistic-icon purple">
                <ClockCircleOutlined />
              </span>

              <div>
                <Text>Pending</Text>

                <Title level={2}>
                  {statistics.pending}
                </Title>

                <small>
                  Awaiting review
                </small>
              </div>
            </Card>
          </Col>

          <Col
            xl={6}
            md={12}
            xs={24}
          >
            <Card
              bordered={false}
              className="owner-statistic-card"
            >
              <span className="owner-statistic-icon green">
                <CheckCircleOutlined />
              </span>

              <div>
                <Text>Approved</Text>

                <Title level={2}>
                  {statistics.approved}
                </Title>

                <small>
                  Live on platform
                </small>
              </div>
            </Card>
          </Col>

          <Col
            xl={6}
            md={12}
            xs={24}
          >
            <Card
              bordered={false}
              className="owner-statistic-card"
            >
              <span className="owner-statistic-icon orange">
                <SyncOutlined />
              </span>

              <div>
                <Text>
                  Action Required
                </Text>

                <Title level={2}>
                  {
                    statistics.actionRequired
                  }
                </Title>

                <small>
                  Needs attention
                </small>
              </div>
            </Card>
          </Col>
        </Row>

        {listings.length === 0 ? (
          <Card
            bordered={false}
            className="owner-listings-empty"
          >
            <Empty
              description={
                <div>
                  <Title level={4}>
                    No car listings submitted
                  </Title>

                  <Text type="secondary">
                    Submit your first vehicle to
                    begin earning through
                    DriveEase.
                  </Text>
                </div>
              }
            >
              <Link to="/list-your-car">
                <Button
                  type="primary"
                  icon={<CarOutlined />}
                >
                  List Your Car
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <div className="owner-cards-grid">
            {listings.map((listing) => {
              const status =
                getStatusDetails(
                  listing.status
                );

              const displayName =
                getDisplayName(listing);

              const canResubmit = [
                "rejected",
                "changes_requested",
              ].includes(listing.status);

              return (
                <article
                  key={listing._id}
                  className="owner-car-card"
                >
                  <div className="owner-car-image">
                    <img
                      src={
                        listing
                          .carImages?.[0] ||
                        "https://placehold.co/900x560?text=DriveEase"
                      }
                      alt={displayName}
                    />

                    <div className="owner-car-image-overlay" />

                    <Tag
                      color={status.color}
                      icon={status.icon}
                      className="owner-car-status"
                    >
                      {status.label}
                    </Tag>
                  </div>

                  <div className="owner-car-body">
                    <div className="owner-car-main">
                      <Title
                        level={3}
                        title={displayName}
                        className="owner-car-title"
                      >
                        {displayName}
                      </Title>

                      <Text className="owner-car-registration">
                        {listing.carDetails
                          ?.registrationNumber ||
                          "Registration pending"}
                      </Text>

                      <div className="owner-car-details">
                        <div>
                          <DollarCircleOutlined />

                          <span>Rent</span>

                          <strong>
                            ₹
                            {formatMoney(
                              listing.carDetails
                                ?.rentPerHour
                            )}
                            /hour
                          </strong>
                        </div>

                        <div>
                          <EnvironmentOutlined />

                          <span>Location</span>

                          <strong>
                            {listing.carDetails
                              ?.location || "-"}
                          </strong>
                        </div>

                        <div>
                          <CarOutlined />

                          <span>Vehicle</span>

                          <strong>
                            {[
                              listing
                                .carDetails?.brand,
                              listing
                                .carDetails?.model,
                            ]
                              .filter(Boolean)
                              .join(" ") || "-"}
                          </strong>
                        </div>

                        <div>
                          <CalendarOutlined />

                          <span>Submitted</span>

                          <strong>
                            {formatDate(
                              listing.createdAt
                            )}
                          </strong>
                        </div>
                      </div>

                      {listing.status ===
                        "approved" && (
                        <Alert
                          type="success"
                          showIcon
                          className="owner-listing-alert"
                          message="Your car is live"
                          description={`Platform commission: ${
                            listing.commissionRate ||
                            10
                          }% per booking.`}
                        />
                      )}

                      {listing.adminRemark && (
                        <Alert
                          type={
                            listing.status ===
                            "rejected"
                              ? "error"
                              : "warning"
                          }
                          showIcon
                          className="owner-listing-alert"
                          message="Admin Feedback"
                          description={
                            listing.adminRemark
                          }
                        />
                      )}
                    </div>

                    <div className="owner-car-actions">
                      {listing.approvedCar?._id && (
                        <Link
                          to={`/booking/${listing.approvedCar._id}`}
                        >
                          <Button
                            block
                            icon={<EyeOutlined />}
                          >
                            View Listing
                          </Button>
                        </Link>
                      )}

                      {canResubmit && (
                        <Link
                          to={`/edit-car-listing/${listing._id}`}
                        >
                          <Button
                            block
                            type="primary"
                            icon={<EditOutlined />}
                          >
                            Edit & Resubmit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}

export default MyCarListings;