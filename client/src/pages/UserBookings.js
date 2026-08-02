import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Card,
  Empty,
  Popconfirm,
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
  EyeOutlined,
  HistoryOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import moment from "moment";

import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import ReviewModal from "../components/ReviewModal";

import {
  cancelBooking,
  getAllBookings,
} from "../redux/actions/bookingActions";

import "./UserBookings.css";

const {
  Title,
  Text,
  Paragraph,
} = Typography;

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString(
    "en-IN"
  );

function UserBookings() {
  const dispatch = useDispatch();

  const bookings = useSelector(
    (state) =>
      state.bookingsReducer?.bookings || []
  );

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading || false
  );

  const [filter, setFilter] =
    useState("all");

  const [reviewOpen, setReviewOpen] =
    useState(false);

  const [
    selectedBooking,
    setSelectedBooking,
  ] = useState(null);

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") ||
        "null"
    );
  } catch (error) {
    console.error(
      "Invalid user information:",
      error
    );
  }

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  const userBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.user === user?._id ||
          booking.user?._id ===
            user?._id
      ),
    [bookings, user?._id]
  );

  const getTripStatus = (booking) => {
    if (
      booking.bookingStatus ===
      "cancelled"
    ) {
      return "cancelled";
    }

    const now = Date.now();

    const pickupTime = new Date(
      booking.bookedTimeSlots?.from
    ).getTime();

    const returnTime = new Date(
      booking.bookedTimeSlots?.to
    ).getTime();

    if (
      Number.isNaN(pickupTime) ||
      Number.isNaN(returnTime)
    ) {
      return "upcoming";
    }

    if (now < pickupTime) {
      return "upcoming";
    }

    if (
      now >= pickupTime &&
      now <= returnTime
    ) {
      return "ongoing";
    }

    return "completed";
  };

  const statistics = useMemo(() => {
    return {
      total: userBookings.length,

      upcoming: userBookings.filter(
        (booking) =>
          getTripStatus(booking) ===
          "upcoming"
      ).length,

      ongoing: userBookings.filter(
        (booking) =>
          getTripStatus(booking) ===
          "ongoing"
      ).length,

      completed: userBookings.filter(
        (booking) =>
          getTripStatus(booking) ===
          "completed"
      ).length,

      cancelled: userBookings.filter(
        (booking) =>
          getTripStatus(booking) ===
          "cancelled"
      ).length,
    };
  }, [userBookings]);

  const filteredBookings = useMemo(() => {
    if (filter === "all") {
      return userBookings;
    }

    return userBookings.filter(
      (booking) =>
        getTripStatus(booking) ===
        filter
    );
  }, [filter, userBookings]);

  const getCarName = (booking) => {
    const name =
      booking.car?.name?.trim();

    if (
      name &&
      !name.startsWith("http://") &&
      !name.startsWith("https://")
    ) {
      return name;
    }

    return (
      [
        booking.car?.brand,
        booking.car?.model,
      ]
        .filter(Boolean)
        .join(" ") ||
      "DriveEase Rental Car"
    );
  };

  const getStatusDetails = (status) => {
    const statusMap = {
      upcoming: {
        color: "blue",
        label: "Upcoming",
      },

      ongoing: {
        color: "orange",
        label: "Ongoing",
      },

      completed: {
        color: "green",
        label: "Completed",
      },

      cancelled: {
        color: "red",
        label: "Cancelled",
      },
    };

    return (
      statusMap[status] ||
      statusMap.upcoming
    );
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setReviewOpen(true);
  };

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <section className="trips-dashboard-page">
        <div className="trips-dashboard-hero">
          <div className="trips-hero-content">
            <Text className="trips-hero-label">
              <CarOutlined />
              YOUR JOURNEYS
            </Text>

            <Title level={1}>
              My Trips
            </Title>

            <Paragraph>
              Manage upcoming reservations,
              ongoing journeys, completed trips
              and booking history from one
              dashboard.
            </Paragraph>

            <div className="trips-hero-features">
              <div>
                <span>
                  <SafetyCertificateOutlined />
                </span>

                <div>
                  <strong>
                    Secure Bookings
                  </strong>

                  <small>
                    View every confirmed rental
                    safely.
                  </small>
                </div>
              </div>

              <div>
                <span>
                  <SyncOutlined />
                </span>

                <div>
                  <strong>
                    Live Trip Status
                  </strong>

                  <small>
                    Upcoming, ongoing and
                    completed.
                  </small>
                </div>
              </div>

              <div>
                <span>
                  <HistoryOutlined />
                </span>

                <div>
                  <strong>
                    Complete History
                  </strong>

                  <small>
                    Access receipts and past
                    journeys.
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="trips-hero-summary">
            <div>
              <ClockCircleOutlined />

              <span>Upcoming</span>

              <strong>
                {statistics.upcoming}
              </strong>
            </div>

            <div>
              <CarOutlined />

              <span>Ongoing</span>

              <strong>
                {statistics.ongoing}
              </strong>
            </div>

            <div>
              <CheckCircleOutlined />

              <span>Completed</span>

              <strong>
                {statistics.completed}
              </strong>
            </div>
          </div>

          <Button
            className="trips-refresh-button"
            icon={<ReloadOutlined />}
            onClick={() =>
              dispatch(getAllBookings())
            }
          >
            Refresh
          </Button>
        </div>

        <div className="trip-statistics-grid">
          <Card
            bordered={false}
            className="trip-statistic-card"
          >
            <span className="trip-stat-icon blue">
              <CarOutlined />
            </span>

            <div>
              <Text>Total Trips</Text>

              <Title level={2}>
                {statistics.total}
              </Title>

              <small>
                All booking records
              </small>
            </div>
          </Card>

          <Card
            bordered={false}
            className="trip-statistic-card"
          >
            <span className="trip-stat-icon purple">
              <ClockCircleOutlined />
            </span>

            <div>
              <Text>Upcoming</Text>

              <Title level={2}>
                {statistics.upcoming}
              </Title>

              <small>
                Scheduled journeys
              </small>
            </div>
          </Card>

          <Card
            bordered={false}
            className="trip-statistic-card"
          >
            <span className="trip-stat-icon orange">
              <SyncOutlined />
            </span>

            <div>
              <Text>Ongoing</Text>

              <Title level={2}>
                {statistics.ongoing}
              </Title>

              <small>
                Active rentals
              </small>
            </div>
          </Card>

          <Card
            bordered={false}
            className="trip-statistic-card"
          >
            <span className="trip-stat-icon green">
              <CheckCircleOutlined />
            </span>

            <div>
              <Text>Completed</Text>

              <Title level={2}>
                {statistics.completed}
              </Title>

              <small>
                Finished journeys
              </small>
            </div>
          </Card>
        </div>

        <div className="trip-filters">
          {[
            "all",
            "upcoming",
            "ongoing",
            "completed",
            "cancelled",
          ].map((item) => (
            <Button
              key={item}
              type={
                filter === item
                  ? "primary"
                  : "default"
              }
              danger={
                item === "cancelled" &&
                filter === item
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item
                .charAt(0)
                .toUpperCase() +
                item.slice(1)}

              <span className="trip-filter-count">
                {item === "all"
                  ? statistics.total
                  : statistics[item]}
              </span>
            </Button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <Card
            bordered={false}
            className="trips-empty-state"
          >
            <Empty description="No trips found">
              <Link to="/">
                <Button
                  type="primary"
                  icon={<CarOutlined />}
                >
                  Explore Cars
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <div className="trip-cards-grid">
            {filteredBookings.map(
              (booking) => {
                const status =
                  getTripStatus(booking);

                const statusDetails =
                  getStatusDetails(status);

                const carName =
                  getCarName(booking);

                return (
                  <article
                    key={booking._id}
                    className={`trip-dashboard-card ${status}`}
                  >
                    <div className="trip-dashboard-image">
                      <img
                        src={
                          booking.car?.image ||
                          "https://placehold.co/900x560?text=DriveEase"
                        }
                        alt={carName}
                      />

                      <div className="trip-image-gradient" />

                      <Tag
                        color={
                          statusDetails.color
                        }
                        className="trip-dashboard-status"
                      >
                        {statusDetails.label}
                      </Tag>
                    </div>

                    <div className="trip-dashboard-body">
                      <div>
                        <Title
                          level={3}
                          className="trip-dashboard-title"
                        >
                          {carName}
                        </Title>

                        <Text className="trip-dashboard-id">
                          Booking #
                          {booking._id?.slice(
                            -8
                          )}
                        </Text>

                        <div className="trip-dashboard-details">
                          <div>
                            <DollarCircleOutlined />

                            <span>Rent</span>

                            <strong>
                              ₹
                              {formatMoney(
                                booking.rentPerHour ||
                                  booking.car
                                    ?.rentPerHour
                              )}
                              /hr
                            </strong>
                          </div>

                          <div>
                            <DollarCircleOutlined />

                            <span>Amount</span>

                            <strong>
                              ₹
                              {formatMoney(
                                booking.totalAmount
                              )}
                            </strong>
                          </div>

                          <div>
                            <CalendarOutlined />

                            <span>Pickup</span>

                            <strong>
                              {moment(
                                booking
                                  .bookedTimeSlots
                                  ?.from
                              ).format(
                                "DD MMM YYYY"
                              )}
                            </strong>
                          </div>

                          <div>
                            <ClockCircleOutlined />

                            <span>Return</span>

                            <strong>
                              {moment(
                                booking
                                  .bookedTimeSlots
                                  ?.to
                              ).format(
                                "DD MMM YYYY"
                              )}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="trip-dashboard-actions">
                        {status ===
                          "upcoming" && (
                          <>
                            <Link
                              to={`/booking-success/${booking._id}`}
                            >
                              <Button
                                block
                                icon={
                                  <EyeOutlined />
                                }
                              >
                                Receipt
                              </Button>
                            </Link>

                            <Popconfirm
                              title="Cancel this booking?"
                              description="This action cannot be undone."
                              okText="Cancel Booking"
                              cancelText="Keep Booking"
                              okButtonProps={{
                                danger: true,
                              }}
                              onConfirm={() =>
                                dispatch(
                                  cancelBooking(
                                    booking._id
                                  )
                                )
                              }
                            >
                              <Button
                                danger
                                block
                                icon={
                                  <CloseCircleOutlined />
                                }
                              >
                                Cancel
                              </Button>
                            </Popconfirm>
                          </>
                        )}

                        {status ===
                          "ongoing" && (
                          <Link
                            to={`/booking-success/${booking._id}`}
                          >
                            <Button
                              block
                              type="primary"
                              icon={
                                <EyeOutlined />
                              }
                            >
                              View Active Trip
                            </Button>
                          </Link>
                        )}

                        {status ===
                          "completed" && (
                          <>
                            <Button
                              type="primary"
                              block
                              icon={
                                <StarOutlined />
                              }
                              onClick={() =>
                                openReviewModal(
                                  booking
                                )
                              }
                            >
                              Leave Review
                            </Button>

                            <Link
                              to={`/booking-success/${booking._id}`}
                            >
                              <Button
                                block
                                icon={
                                  <EyeOutlined />
                                }
                              >
                                Receipt
                              </Button>
                            </Link>
                          </>
                        )}

                        {status ===
                          "cancelled" &&
                          booking.car?._id && (
                            <Link
                              to={`/booking/${booking.car._id}`}
                            >
                              <Button
                                type="primary"
                                block
                                icon={
                                  <ReloadOutlined />
                                }
                              >
                                Book Again
                              </Button>
                            </Link>
                          )}
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}

        <ReviewModal
          open={reviewOpen}
          bookingId={
            selectedBooking?._id
          }
          onClose={() => {
            setReviewOpen(false);
            setSelectedBooking(null);
          }}
          onSuccess={() => {
            setReviewOpen(false);
            setSelectedBooking(null);
            dispatch(getAllBookings());
          }}
        />
      </section>
    </DefaultLayout>
  );
}

export default UserBookings;