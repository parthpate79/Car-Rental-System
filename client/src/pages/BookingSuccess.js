import React, {
  useEffect,
  useState,
} from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Row,
  Spin,
  Tag,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  CarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  PrinterOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import DefaultLayout from "../components/DefaultLayout";
import { getBookingById } from "../redux/actions/bookingActions";

const { Title, Text, Paragraph } = Typography;

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-IN");

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Countdown Timer component
function PickupCountdown({ pickupTime }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!pickupTime) return;

    const target = new Date(pickupTime).getTime();

    const calc = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [pickupTime]);

  if (!timeLeft) return null;

  return (
    <div className="pickup-countdown">
      <div className="countdown-label">
        <ClockCircleOutlined />
        <span>Time until pickup</span>
      </div>
      <div className="countdown-tiles">
        <div className="countdown-tile">
          <strong>{String(timeLeft.days).padStart(2, "0")}</strong>
          <small>Days</small>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-tile">
          <strong>{String(timeLeft.hours).padStart(2, "0")}</strong>
          <small>Hours</small>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-tile">
          <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong>
          <small>Mins</small>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-tile">
          <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong>
          <small>Secs</small>
        </div>
      </div>
    </div>
  );
}

function BookingSuccess() {
  const { bookingId } = useParams();

  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const [booking, setBooking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // Set page title
  useEffect(() => {
    document.title = "Booking Confirmed — DriveEase";
    return () => {
      document.title = "DriveEase";
    };
  }, []);

  useEffect(() => {
    const loadBooking = async () => {
      const bookingData = await dispatch(
        getBookingById(bookingId)
      );

      setBooking(bookingData);
      setLoading(false);
    };

    loadBooking();
  }, [bookingId, dispatch]);

  useEffect(() => {
    if (
      booking &&
      searchParams.get("print") === "true"
    ) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [booking, searchParams]);

  if (loading) {
    return (
      <DefaultLayout>
        <div className="booking-success-loading">
          <Spin size="large" />
        </div>
      </DefaultLayout>
    );
  }

  if (!booking) {
    return (
      <DefaultLayout>
        <Card className="booking-receipt-card">
          <Empty description="Booking not found">
            <Link to="/userbookings">
              <Button type="primary">
                My Bookings
              </Button>
            </Link>
          </Empty>
        </Card>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="booking-success-page">
        <div className="booking-success-header">
          <CheckCircleFilled />

          <Title>
            Booking Confirmed
          </Title>

          <Paragraph>
            Your reservation has been created
            successfully.
          </Paragraph>

          <Tag color="green">
            {booking.bookingStatus}
          </Tag>
        </div>

        {/* Live countdown to pickup */}
        <PickupCountdown pickupTime={booking.bookedTimeSlots?.from} />

        <Card
          bordered={false}
          className="booking-receipt-card"
        >
          <div className="receipt-top">
            <div>
              <Title level={2}>
                DriveEase
              </Title>

              <Text>
                Premium Car Rental
              </Text>
            </div>

            <div className="receipt-number">
              <Text type="secondary">
                Booking ID
              </Text>

              <strong>{booking._id}</strong>
            </div>
          </div>

          <Divider />

          <Row gutter={[25, 25]}>
            <Col lg={9} xs={24}>
              <div className="receipt-car-image">
                <img
                  src={
                    booking.car?.image ||
                    "https://placehold.co/700x450?text=DriveEase"
                  }
                  alt={
                    booking.car?.name ||
                    "Rental car"
                  }
                />
              </div>
            </Col>

            <Col lg={15} xs={24}>
              <Title level={3}>
                {booking.car?.name ||
                  "Rental Car"}
              </Title>

              <div className="receipt-details-grid">
                <div>
                  <CalendarOutlined />
                  <span>Pickup</span>
                  <strong>
                    {formatDateTime(
                      booking.bookedTimeSlots
                        ?.from
                    )}
                  </strong>
                </div>

                <div>
                  <CalendarOutlined />
                  <span>Return</span>
                  <strong>
                    {formatDateTime(
                      booking.bookedTimeSlots
                        ?.to
                    )}
                  </strong>
                </div>

                <div>
                  <ClockCircleOutlined />
                  <span>Duration</span>
                  <strong>
                    {booking.totalHours} hours
                  </strong>
                </div>

                <div>
                  <UserOutlined />
                  <span>Driver</span>
                  <strong>
                    {booking.driverRequired
                      ? "Professional Driver"
                      : "Self Drive"}
                  </strong>
                </div>

                <div>
                  <CreditCardOutlined />
                  <span>Payment</span>
                  <strong>
                    {booking.paymentMethod ===
                    "card"
                      ? "Card Payment"
                      : "Pay at Pickup"}
                  </strong>
                </div>

                <div>
                  <SafetyCertificateOutlined />
                  <span>Payment Status</span>
                  <strong>
                    {booking.paymentStatus}
                  </strong>
                </div>

                <div>
                  <DollarCircleOutlined />
                  <span>Rate</span>
                  <strong>
                    ₹{formatMoney(booking.rentPerHour)}/hr
                  </strong>
                </div>

                <div>
                  <CarOutlined />
                  <span>Booking Status</span>
                  <strong>
                    {booking.bookingStatus}
                  </strong>
                </div>
              </div>
            </Col>
          </Row>

          <Divider />

          <Title level={4}>
            Price Breakdown
          </Title>

          <div className="receipt-price-list">
            <div>
              <span>
                Base Rent (
                {booking.totalHours} × ₹
                {formatMoney(
                  booking.rentPerHour
                )}
                )
              </span>

              <strong>
                ₹
                {formatMoney(
                  booking.baseAmount
                )}
              </strong>
            </div>

            <div>
              <span>Driver Charge</span>

              <strong>
                ₹
                {formatMoney(
                  booking.driverCharge
                )}
              </strong>
            </div>

            <div>
              <span>Service Fee (3%)</span>

              <strong>
                ₹
                {formatMoney(
                  booking.serviceFee
                )}
              </strong>
            </div>
          </div>

          <div className="receipt-grand-total">
            <span>Total Amount</span>

            <strong>
              ₹
              {formatMoney(
                booking.totalAmount
              )}
            </strong>
          </div>

          {booking.transactionId && (
            <div className="receipt-transaction">
              <Text type="secondary">
                Transaction ID
              </Text>

              <strong>
                {booking.transactionId}
              </strong>
            </div>
          )}

          {/* Important reminder */}
          <div className="receipt-reminder no-print">
            <SafetyCertificateOutlined />
            <div>
              <strong>Pickup Reminder</strong>
              <p>
                Please carry a valid government-issued ID at the time of pickup.
                {booking.paymentMethod === "pay_at_pickup"
                  ? " Payment is to be made in cash at pickup."
                  : " Payment has been processed online."}
              </p>
            </div>
          </div>

          <div className="receipt-actions no-print">
            <Button
              size="large"
              icon={<PrinterOutlined />}
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>

            <Link to="/userbookings">
              <Button
                size="large"
                icon={<CarOutlined />}
              >
                My Bookings
              </Button>
            </Link>

            <Link to="/">
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
              >
                Return Home
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </DefaultLayout>
  );
}

export default BookingSuccess;