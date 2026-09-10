import dayjs from "dayjs";
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Empty,
  Modal,
  Radio,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { useLoaderData } from "react-router-dom";

import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { getAllCars } from "../redux/actions/carsActions";
import { bookCar } from "../redux/actions/bookingActions";

const { RangePicker } = DatePicker;
const { Title, Text, Paragraph } = Typography;

const DRIVER_RATE = 30;
const SERVICE_FEE_PERCENTAGE = 3;

function BookingCar() {
  const carId = useLoaderData();
  const dispatch = useDispatch();

  const carsState = useSelector(
    (state) => state.carsReducer
  );

  const loading = useSelector(
    (state) => state.alertsReducer?.loading || false
  );

  const cars = useMemo(
    () =>
      Array.isArray(carsState?.cars)
        ? carsState.cars
        : [],
    [carsState?.cars]
  );

  const [selectedRange, setSelectedRange] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const from = Number(params.get('from')), to = Number(params.get('to'));
    return from > Date.now() && to > from ? [dayjs(from), dayjs(to)] : null;
  });

  const [driverRequired, setDriverRequired] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("pay_at_pickup");

  const [showSlotsModal, setShowSlotsModal] =
    useState(false);

  useEffect(() => {
    if (cars.length === 0) {
      dispatch(getAllCars());
    }
  }, [cars.length, dispatch]);

  const car = useMemo(
    () => cars.find((item) => item._id === carId),
    [cars, carId]
  );

  const rentPerHour = Number(
    car?.rentPerHour || 0
  );

  const bookingSummary = useMemo(() => {
    if (!selectedRange) {
      return {
        from: null,
        to: null,
        totalHours: 0,
        baseAmount: 0,
        driverCharge: 0,
        serviceFee: 0,
        totalAmount: 0,
      };
    }

    const [fromValue, toValue] = selectedRange;

    const milliseconds =
      toValue.valueOf() - fromValue.valueOf();

    const totalHours = Math.ceil(
      milliseconds / (1000 * 60 * 60)
    );

    const baseAmount = totalHours * rentPerHour;

    const driverCharge = driverRequired
      ? totalHours * DRIVER_RATE
      : 0;

    const subtotal =
      baseAmount + driverCharge;

    const serviceFee = Math.round(
      subtotal *
        (SERVICE_FEE_PERCENTAGE / 100)
    );

    return {
      from: fromValue,
      to: toValue,
      totalHours,
      baseAmount,
      driverCharge,
      serviceFee,
      totalAmount: subtotal + serviceFee,
    };
  }, [
    selectedRange,
    rentPerHour,
    driverRequired,
  ]);

  const hasBookingConflict = useMemo(() => {
    if (!selectedRange || !car) {
      return false;
    }

    const selectedFrom =
      selectedRange[0].valueOf();

    const selectedTo =
      selectedRange[1].valueOf();

    return (car.bookedTimeSlots || []).some(
      (slot) => {
        const existingFrom = new Date(
          slot.from
        ).getTime();

        const existingTo = new Date(
          slot.to
        ).getTime();

        if (
          Number.isNaN(existingFrom) ||
          Number.isNaN(existingTo)
        ) {
          return false;
        }

        return (
          selectedFrom < existingTo &&
          selectedTo > existingFrom
        );
      }
    );
  }, [selectedRange, car]);

  const disablePastDates = (current) =>
    current &&
    current.endOf("day").valueOf() <
      Date.now();

  const handleRangeChange = (values) => {
    if (!values || values.length !== 2) {
      setSelectedRange(null);
      return;
    }

    if (
      values[1].valueOf() <=
      values[0].valueOf()
    ) {
      setSelectedRange(null);
      return;
    }

    setSelectedRange(values);
  };

  const createRequestObject = (token = null) => ({
    token,
    car: car._id,
    driverRequired,
    paymentMethod,

    bookedTimeSlots: {
      from:
        bookingSummary.from.toISOString(),

      to:
        bookingSummary.to.toISOString(),
    },
  });

  const handlePayAtPickup = () => {
    dispatch(
      bookCar(createRequestObject())
    );
  };


  const canBook =
    Boolean(car) &&
    Boolean(selectedRange) &&
    bookingSummary.totalHours >= 1 &&
    !hasBookingConflict &&
    selectedRange[0].valueOf() > Date.now() && !loading;

  if (!car && !loading) {
    return (
      <DefaultLayout>
        <Card className="booking-empty-card">
          <Empty description="Car not found">
            <Button
              type="primary"
              href="/"
            >
              Return to Cars
            </Button>
          </Empty>
        </Card>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <section className="booking-page">
        <div className="booking-page-heading">
          <Text className="section-label">
            COMPLETE YOUR RESERVATION
          </Text>

          <Title level={1}>
            Book {car?.name || "your car"}
          </Title>

          <Paragraph>
            Select your booking period, review the
            price breakdown and choose a payment
            method.
          </Paragraph>
        </div>

        <Row gutter={[30, 30]}>
          <Col xl={13} lg={12} xs={24}>
            <Card
              className="booking-car-card"
              bordered={false}
            >
              <div className="booking-car-image-wrapper">
                <img
                  src={
                    car?.image ||
                    "https://placehold.co/900x600?text=DriveEase"
                  }
                  alt={`${car?.name || "Car"} rental`}
                />

                <Tag
                  color="green"
                  className="booking-availability-tag"
                >
                  Available for booking
                </Tag>
              </div>

              <div className="booking-car-details">
                <Title level={2}>
                  {car?.name}
                </Title>

                <Row gutter={[14, 14]}>
                  <Col sm={8} xs={24}>
                    <div className="booking-spec-box">
                      <TeamOutlined />
                      <div>
                        <small>Capacity</small>
                        <strong>
                          {car?.capacity || "-"} Seats
                        </strong>
                      </div>
                    </div>
                  </Col>

                  <Col sm={8} xs={24}>
                    <div className="booking-spec-box">
                      <ThunderboltOutlined />
                      <div>
                        <small>Fuel Type</small>
                        <strong>
                          {car?.fuelType || "-"}
                        </strong>
                      </div>
                    </div>
                  </Col>

                  <Col sm={8} xs={24}>
                    <div className="booking-spec-box">
                      <DollarCircleOutlined />
                      <div>
                        <small>Rental Rate</small>
                        <strong>
                          ₹{rentPerHour}/hour
                        </strong>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Divider />

                <Row gutter={[20, 20]}>
                  <Col span={8}>
                    <div className="booking-benefit">
                      <SafetyCertificateOutlined />
                      <span>Safe Ride</span>
                    </div>
                  </Col>

                  <Col span={8}>
                    <div className="booking-benefit">
                      <ClockCircleOutlined />
                      <span>24/7 Support</span>
                    </div>
                  </Col>

                  <Col span={8}>
                    <div className="booking-benefit">
                      <CheckCircleOutlined />
                      <span>Verified Car</span>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

          <Col xl={11} lg={12} xs={24}>
            <Card
              className="booking-form-card"
              bordered={false}
            >
              <div className="booking-form-title">
                <div className="booking-form-icon">
                  <CalendarOutlined />
                </div>

                <div>
                  <Title level={3}>
                    Select Pickup & Return Time
                  </Title>

                  <Text type="secondary">
                    Minimum booking duration is one hour
                  </Text>
                </div>
              </div>

              <RangePicker value={selectedRange}
                className="booking-range-picker"
                showTime={{
                  format: "HH:mm",
                  minuteStep: 15,
                }}
                format="DD MMM YYYY, HH:mm"
                disabledDate={disablePastDates}
                onChange={handleRangeChange}
                placeholder={[
                  "Pickup date and time",
                  "Return date and time",
                ]}
              />

              <Button
                block
                icon={<ClockCircleOutlined />}
                onClick={() =>
                  setShowSlotsModal(true)
                }
                className="booked-slots-button"
              >
                View Existing Booked Slots
              </Button>

              {hasBookingConflict && (
                <Alert
                  type="error"
                  showIcon
                  message="Selected slot is unavailable"
                  description="This car already has a booking that overlaps with the selected pickup and return time."
                />
              )}

              {selectedRange && selectedRange[0].valueOf() <= Date.now() && <Alert type="warning" showIcon message="Choose a pickup time in the future" style={{ marginTop: 16 }} />}

              {selectedRange && (
                <>
                  <Divider />

                  <Title level={3}>
                    Booking Summary
                  </Title>

                  <div className="booking-summary-list">
                    <div className="booking-summary-row">
                      <span>Pickup</span>
                      <strong>
                        {bookingSummary.from.format(
                          "DD MMM YYYY, HH:mm"
                        )}
                      </strong>
                    </div>

                    <div className="booking-summary-row">
                      <span>Return</span>
                      <strong>
                        {bookingSummary.to.format(
                          "DD MMM YYYY, HH:mm"
                        )}
                      </strong>
                    </div>

                    <div className="booking-summary-row">
                      <span>Total Duration</span>
                      <strong>
                        {bookingSummary.totalHours} hours
                      </strong>
                    </div>

                    <div className="booking-summary-row">
                      <span>Rent per Hour</span>
                      <strong>
                        ₹{rentPerHour}
                      </strong>
                    </div>

                    <div className="booking-summary-row">
                      <span>Base Rent</span>
                      <strong>
                        ₹
                        {bookingSummary.baseAmount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="driver-option-box">
                    <Checkbox
                      checked={driverRequired}
                      onChange={(event) =>
                        setDriverRequired(
                          event.target.checked
                        )
                      }
                    >
                      <strong>
                        Add professional driver
                      </strong>

                      <div className="driver-option-description">
                        ₹{DRIVER_RATE} per booking hour
                      </div>
                    </Checkbox>
                  </div>

                  <div className="booking-summary-list">
                    <div className="booking-summary-row">
                      <span>Driver Charge</span>
                      <strong>
                        ₹
                        {bookingSummary.driverCharge.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                    <div className="booking-summary-row">
                      <span>
                        Service Fee (
                        {SERVICE_FEE_PERCENTAGE}%)
                      </span>
                      <strong>
                        ₹
                        {bookingSummary.serviceFee.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="booking-total-box">
                    <span>Total Payable</span>
                    <strong>
                      ₹
                      {bookingSummary.totalAmount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <Divider />

                  <Title level={4}>
                    Payment Method
                  </Title>

                  <Radio.Group
                    className="payment-method-group"
                    value={paymentMethod}
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  >
                    <Radio.Button value="pay_at_pickup">
                      <WalletOutlined />
                      Pay at Pickup
                    </Radio.Button>

                    <Radio.Button value="card" disabled>
                      <CreditCardOutlined />
                      Card payment (not available)
                    </Radio.Button>
                  </Radio.Group>

                  {(
                    <Button
                      type="primary"
                      block
                      size="large"
                      disabled={!canBook}
                      onClick={handlePayAtPickup}
                      className="booking-submit-button"
                      icon={<CarOutlined />}
                    >
                      Confirm Booking
                    </Button>
                  )
                  }

                  <Text className="payment-security-text">
                    <SafetyCertificateOutlined /> Reserve now and pay at pickup. No online charge.
                  </Text>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </section>

      <Modal
        title="Existing Booked Time Slots"
        open={showSlotsModal}
        footer={null}
        onCancel={() =>
          setShowSlotsModal(false)
        }
      >
        {car?.bookedTimeSlots?.length > 0 ? (
          <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%" }}
          >
            {car.bookedTimeSlots.map(
              (slot, index) => (
                <div
                  className="existing-slot"
                  key={slot._id || index}
                >
                  <ClockCircleOutlined />

                  <div>
                    <strong>
                      {new Date(
                        slot.from
                      ).toLocaleString("en-IN")}
                    </strong>

                    <span>to</span>

                    <strong>
                      {new Date(
                        slot.to
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              )
            )}
          </Space>
        ) : (
          <Empty description="No bookings yet" />
        )}
      </Modal>
    </DefaultLayout>
  );
}

export default BookingCar;
