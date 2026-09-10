import dayjs from "dayjs";
import CustomerReviews from "../components/CustomerReviews";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Empty,
  Input,
  Row,
  Select,
  Skeleton,
  Slider,
  Tag,
  Typography,
} from "antd";
import {
  CarOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  StarOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import DefaultLayout from "../components/DefaultLayout";
import { getAllCars } from "../redux/actions/carsActions";

const { RangePicker } = DatePicker;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const MAX_RENT = 10000;

// Derive a category badge from car capacity
function getCarCategory(capacity) {
  const seats = Number(capacity);
  if (seats <= 0 || isNaN(seats)) return null;
  return { label: `${seats} seats`, color: "#176b5b" };
}

// FAQ data
const FAQ_ITEMS = [
  {
    key: "1",
    label: "How do I book a car on DriveEase?",
    children:
      "Select your desired pickup and return dates using the date picker on the Home page, then browse the available cars. Click 'View & Book' on any car, review the pricing breakdown and confirm your booking. You'll receive an instant booking confirmation.",
  },
  {
    key: "2",
    label: "Can I cancel my booking?",
    children:
      "Yes! You can cancel any active booking from the 'My Bookings' page before your pickup time. Click 'Cancel Booking' next to your reservation and it will be cancelled immediately.",
  },
  {
    key: "3",
    label: "What payment methods are accepted?",
    children:
      "Choose Pay at Pickup to reserve your car and pay when you collect it. Online card payments are not currently available. Review the total before confirming.",
  },
  {
    key: "4",
    label: "Is a professional driver available?",
    children:
      "Yes! During the booking process you can add a professional driver for just ₹30 per hour. The driver charge is included in your total booking amount shown in the price breakdown.",
  },
  {
    key: "5",
    label: "How do I list my own car on DriveEase?",
    children:
      "If you own a car and want to earn by renting it out, navigate to 'List Your Car' in the top navigation. Fill in your car details, upload photos and submit. Our admin team reviews each submission. Track its status in My Listings.",
  },
  {
    key: "6",
    label: "How is the rental price calculated?",
    children:
      "The price is calculated based on your rental duration (in hours). Partial hours are rounded up. Total = (Hours × Rate/hour) + Optional Driver Charge + 3% Service Fee. The full breakdown is shown before you confirm your booking — no hidden charges.",
  },
];

// How It Works steps
const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    icon: <SearchOutlined />,
    title: "Search & Filter",
    desc: "Select your pickup and return dates, choose fuel type, seating capacity and price range to find the perfect car.",
  },
  {
    step: "02",
    icon: <CarOutlined />,
    title: "Choose & Book",
    desc: "Pick your favourite vehicle, review the transparent price breakdown and confirm your reservation in seconds.",
  },
  {
    step: "03",
    icon: <StarOutlined />,
    title: "Drive & Enjoy",
    desc: "Collect your car at the agreed time, enjoy your journey and return it hassle-free. Leave a review to help others.",
  },
];

function SkeletonCarCard() {
  return (
    <Card className="premium-car-card skeleton-card" bordered={false}>
      <Skeleton.Image active className="skeleton-car-image" />
      <div className="skeleton-card-body">
        <Skeleton active paragraph={{ rows: 3 }} />
      </div>
    </Card>
  );
}

function Home() {
  const dispatch = useDispatch();
  const homeRef = useRef(null);

  const carsState = useSelector((state) => state.carsReducer);
  const alertsState = useSelector((state) => state.alertsReducer);

  const cars = useMemo(
    () => (Array.isArray(carsState?.cars) ? carsState.cars : []),
    [carsState?.cars]
  );

  const loading = alertsState?.loading || false;

  const [searchText, setSearchText] = useState("");
  const [fuelType, setFuelType] = useState("all");
  const [location, setLocation] = useState("all");
  const [capacity, setCapacity] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [maximumRent, setMaximumRent] = useState(MAX_RENT);
  const [selectedRange, setSelectedRange] = useState(null);

  // Set page title
  useEffect(() => {
    document.title = "DriveEase — Find & Book Premium Rental Cars";
  }, []);

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  const fuelOptions = useMemo(() => {
    const uniqueFuelTypes = [
      ...new Set(
        cars
          .map((car) => car.fuelType)
          .filter(Boolean)
      ),
    ];

    return uniqueFuelTypes.map((fuel) => ({
      label: fuel,
      value: fuel,
    }));
  }, [cars]);

  const locationOptions = useMemo(() => [...new Set(cars.map(car => car.location).filter(Boolean))].sort().map(city => ({ label: city, value: city })), [cars]);

  const capacityOptions = useMemo(() => {
    const uniqueCapacities = [
      ...new Set(
        cars
          .map((car) => Number(car.capacity))
          .filter((value) => Number.isFinite(value))
      ),
    ].sort((a, b) => a - b);

    return uniqueCapacities.map((value) => ({
      label: `${value} Seats`,
      value: String(value),
    }));
  }, [cars]);

  const maximumAvailableRent = useMemo(() => {
    const highestRent = Math.max(
      ...cars.map((car) => Number(car.rentPerHour) || 0),
      1000
    );

    return Math.ceil(highestRent / 500) * 500;
  }, [cars]);

  useEffect(() => {
    setMaximumRent(maximumAvailableRent);
  }, [maximumAvailableRent]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isCarAvailable = (car) => {
    if (!selectedRange) {
      return true;
    }

    const [selectedFrom, selectedTo] = selectedRange;

    const bookedSlots = Array.isArray(car.bookedTimeSlots)
      ? car.bookedTimeSlots
      : [];

    return !bookedSlots.some((slot) => {
      const bookedFrom = new Date(slot.from).getTime();
      const bookedTo = new Date(slot.to).getTime();

      if (
        Number.isNaN(bookedFrom) ||
        Number.isNaN(bookedTo)
      ) {
        return false;
      }

      return selectedFrom < bookedTo && selectedTo > bookedFrom;
    });
  };

  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (searchText.trim()) {
      const searchValue = searchText.toLowerCase().trim();

      result = result.filter((car) =>
        car.name?.toLowerCase().includes(searchValue)
      );
    }

    if (fuelType !== "all") {
      result = result.filter(
        (car) => car.fuelType === fuelType
      );
    }

    if (location !== "all") result = result.filter(car => car.location === location);

    if (capacity !== "all") {
      result = result.filter(
        (car) => String(car.capacity) === capacity
      );
    }

    result = result.filter(
      (car) =>
        Number(car.rentPerHour) <= maximumRent
    );

    if (selectedRange) {
      result = result.filter(isCarAvailable);
    }

    if (sortOrder === "price-low") {
      result.sort(
        (firstCar, secondCar) =>
          Number(firstCar.rentPerHour) -
          Number(secondCar.rentPerHour)
      );
    }

    if (sortOrder === "price-high") {
      result.sort(
        (firstCar, secondCar) =>
          Number(secondCar.rentPerHour) -
          Number(firstCar.rentPerHour)
      );
    }

    if (sortOrder === "name") {
      result.sort((firstCar, secondCar) =>
        firstCar.name.localeCompare(secondCar.name)
      );
    }

    return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cars,
    searchText,
    fuelType,
    location,
    capacity,
    maximumRent,
    selectedRange,
    sortOrder,
  ]);

  const handleDateChange = (values) => {
    if (!values || values.length !== 2) {
      setSelectedRange(null);
      return;
    }

    const selectedFrom = values[0].valueOf();
    const selectedTo = values[1].valueOf();

    if (selectedTo <= selectedFrom) {
      setSelectedRange(null);
      return;
    }

    setSelectedRange([selectedFrom, selectedTo]);
  };

  const disablePastDates = (current) => {
    if (!current) {
      return false;
    }

    return current.endOf("day").valueOf() < Date.now();
  };

  const resetFilters = () => {
    setSearchText("");
    setFuelType("all");
    setLocation("all");
    setCapacity("all");
    setSortOrder("default");
    setMaximumRent(maximumAvailableRent);
    setSelectedRange(null);
  };

  useEffect(() => {
    if (!window.IntersectionObserver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    homeRef.current?.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [filteredCars]);

  return (
    <DefaultLayout>
      <div ref={homeRef} className="showroom-home">


      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-overlay" />
        <div className="hero-ambient hero-ambient-one" aria-hidden="true" />
        <div className="hero-ambient hero-ambient-two" aria-hidden="true" />
        <div className="hero-visual" aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1500&q=85" alt="" fetchPriority="high" />
          <div className="hero-visual-gradient" />
          <span className="hero-photo-label">MADE FOR THE OPEN ROAD</span>
        </div>
        <div className="hero-float-label" aria-hidden="true"><span>↗</span><div>Your trip.<strong>Your pace.</strong></div></div>

        <div className="home-hero-content">
          <Tag className="hero-badge">
            MORE THAN A RENTAL. A NEW POSSIBILITY.
          </Tag>

          <Title className="hero-title">
            <span>Find your</span><span className="hero-gradient-word">freedom.</span>
          </Title>

          <Paragraph className="hero-description">
            Big adventures. Spontaneous detours. Everyday escapes.
            Find the keys to your next chapter, with a car and an hourly rate that fit your plans.
          </Paragraph>

          <div className="hero-actions">
            <Button
              type="primary"
              size="large"
              icon={<CarOutlined />}
              onClick={() => {
                document
                  .getElementById("available-cars")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              Find my ride ↗
            </Button>

            <Link to="/userbookings">
              <Button size="large">
                View My Bookings
              </Button>
            </Link>
          </div>
          <div className="hero-assurances"><span><SafetyCertificateOutlined /> Clear pricing</span><span><ClockCircleOutlined /> Flexible hours</span><span><CarOutlined /> Pay at pickup</span></div>
        </div>
      </section>

      <div className="journey-ribbon" aria-hidden="true"><div className="journey-ribbon-track">{[0,1].map(copy => <span key={copy}>CITY LIGHTS <b>✦</b> WEEKEND ESCAPES <b>✦</b> OPEN ROADS <b>✦</b> YOUR NEXT CHAPTER <b>✦</b> </span>)}</div></div>

      {/* Statistics */}
      <section className="stats-section" data-reveal>
        <Row gutter={[20, 20]}>
          <Col lg={6} md={12} xs={24}>
            <Card className="modern-stats-card" bordered={false}>
              <div className="stats-icon">
                <CarOutlined />
              </div>

              <div>
                <Title level={2}>
                  {cars.length}
                </Title>
                <Text>Cars in the fleet</Text>
              </div>
            </Card>
          </Col>

          <Col lg={6} md={12} xs={24}>
            <Card className="modern-stats-card" bordered={false}>
              <div className="stats-icon">
                <ClockCircleOutlined />
              </div>

              <div>
                <Title level={2}>Hourly</Title>
                <Text>Flexible rental periods</Text>
              </div>
            </Card>
          </Col>

          <Col lg={6} md={12} xs={24}>
            <Card className="modern-stats-card" bordered={false}>
              <div className="stats-icon">
                <SafetyCertificateOutlined />
              </div>

              <div>
                <Title level={2}>Upfront</Title>
                <Text>Price breakdown</Text>
              </div>
            </Card>
          </Col>

          <Col lg={6} md={12} xs={24}>
            <Card className="modern-stats-card" bordered={false}>
              <div className="stats-icon">
                <ThunderboltOutlined />
              </div>

              <div>
                <Title level={2}>One place</Title>
                <Text>Bookings & receipts</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Search and Filters */}
      <section id="available-cars" className="filter-section" data-reveal>
        <div className="section-heading">
          <div>
            <Text className="section-label">
              FIND YOUR CAR
            </Text>

            <Title level={2}>
              Where will the road take you?
            </Title>

            <Paragraph>
              Select your booking period and use filters to find
              the right vehicle.
            </Paragraph>
          </div>

          <Button
            icon={<ReloadOutlined />}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>

        <Card className="filter-card" bordered={false}>
          <Row gutter={[18, 18]}>
            <Col lg={8} md={12} xs={24}>
              <Text className="filter-label">
                Booking date and time
              </Text>

              <RangePicker
                className="full-width-control"
                value={selectedRange ? selectedRange.map(value => dayjs(value)) : null}
                showTime={{
                  format: "HH:mm",
                  minuteStep: 15,
                }}
                format="DD MMM YYYY, HH:mm"
                disabledDate={disablePastDates}
                onChange={handleDateChange}
                placeholder={[
                  "Pickup date and time",
                  "Return date and time",
                ]}
              />
            </Col>

            <Col lg={6} md={12} xs={24}>
              <Text className="filter-label">
                Search car
              </Text>

              <Input
                aria-label="Search cars by name"
                className="full-width-control"
                prefix={<SearchOutlined />}
                placeholder="Search by car name"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                allowClear
              />
            </Col>

            <Col lg={5} md={12} xs={24}>
              <Text className="filter-label">
                Fuel type
              </Text>

              <Select
                className="full-width-control"
                value={fuelType}
                onChange={setFuelType}
                options={[
                  {
                    label: "All Fuel Types",
                    value: "all",
                  },
                  ...fuelOptions,
                ]}
              />
            </Col>

            <Col lg={5} md={12} xs={24}>
              <Text className="filter-label">
                Seating capacity
              </Text>

              <Select
                className="full-width-control"
                value={capacity}
                onChange={setCapacity}
                options={[
                  {
                    label: "All Capacities",
                    value: "all",
                  },
                  ...capacityOptions,
                ]}
              />
            </Col>

            <Col lg={8} md={12} xs={24}>
              <Text className="filter-label">Pickup city</Text>
              <Select aria-label="Pickup city" className="full-width-control" value={location} onChange={setLocation} options={[{ label: "All pickup cities", value: "all" }, ...locationOptions]} />
            </Col>

            <Col lg={8} md={12} xs={24}>
              <Text className="filter-label">
                Maximum rent: ₹{maximumRent}/hour
              </Text>

              <Slider
                min={0}
                max={maximumAvailableRent}
                step={100}
                value={maximumRent}
                onChange={setMaximumRent}
                tooltip={{
                  formatter: (value) => `₹${value}`,
                }}
              />
            </Col>

            <Col lg={6} md={12} xs={24}>
              <Text className="filter-label">
                Sort vehicles
              </Text>

              <Select
                className="full-width-control"
                value={sortOrder}
                onChange={setSortOrder}
                suffixIcon={<FilterOutlined />}
                options={[
                  {
                    label: "Default Order",
                    value: "default",
                  },
                  {
                    label: "Price: Low to High",
                    value: "price-low",
                  },
                  {
                    label: "Price: High to Low",
                    value: "price-high",
                  },
                  {
                    label: "Name: A to Z",
                    value: "name",
                  },
                ]}
              />
            </Col>
          </Row>
        </Card>
      </section>

      {/* Car Listing */}
      <section
        id="fleet-results"
        className="cars-section"
      >
        <div className="section-heading">
          <div>
            <Text className="section-label">
              AVAILABLE FLEET
            </Text>

            <Title level={2}>
              Meet your next adventure.
            </Title>

            <Paragraph>
              Showing {filteredCars.length} of {cars.length} cars
            </Paragraph>
          </div>
        </div>

        <div className="fleet-quick-filters" aria-label="Quick fuel filters">
          <button className={fuelType === 'all' ? 'selected' : ''} aria-pressed={fuelType === 'all'} onClick={() => setFuelType('all')}>All rides <span>{cars.length}</span></button>
          {fuelOptions.map(fuel => <button key={fuel.value} aria-pressed={fuelType === fuel.value} className={fuelType === fuel.value ? 'selected' : ''} onClick={() => setFuelType(fuel.value)}>{fuel.label}</button>)}
          <span className="fleet-caption">A car for every kind of day.</span>
        </div>
        {carsState.error && <Alert type="warning" showIcon message="We couldn’t load the fleet" description="The rental service may be waking up. Please try again in a moment." action={<Button onClick={() => dispatch(getAllCars())}>Try again</Button>} style={{ marginBottom: 24 }} />}
        {/* Skeleton loading while fetching */}
        {loading && cars.length === 0 ? (
          <Row gutter={[24, 24]} className="car-grid">
            {[1, 2, 3, 4].map((n) => (
              <Col xl={8} lg={8} md={12} sm={24} xs={24} key={n}>
                <SkeletonCarCard />
              </Col>
            ))}
          </Row>
        ) : filteredCars.length === 0 ? (
          <Card className="empty-state-card" bordered={false}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Title level={4}>
                    No matching cars found
                  </Title>

                  <Text type="secondary">
                    Try changing your filters or selecting another
                    booking period.
                  </Text>
                </div>
              }
            >
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[24, 24]} className="car-grid">
            {filteredCars.map((car, index) => {
              const available = isCarAvailable(car);
              const category = getCarCategory(car.capacity);

              return (
                <Col
                  xl={8}
                  lg={8}
                  md={12}
                  sm={24}
                  xs={24}
                  key={car._id}
                  className="car-grid-column" data-reveal
                >
                  <Card
                    className="premium-car-card"
                    bordered={false}
                    style={{
                      "--card-delay": `${Math.min(index % 3, 2) * 70}ms`,
                    }}
                    cover={
                      <div className="car-image-wrapper">
                        <img
                          src={
                            car.image ||
                            "/car-placeholder.svg"
                          }
                          alt={`${car.name} rental car`}
                          className="car-card-image"
                          loading="lazy"
                          onError={event => { if (!event.currentTarget.src.endsWith('/car-placeholder.svg')) event.currentTarget.src = '/car-placeholder.svg'; }}
                        />

                        <div className="car-image-overlay" />
                        <div className="car-card-shine" />

                        {/* Hover overlay with quick specs */}
                        <div className="car-hover-overlay">
                          <div className="car-hover-spec">
                            <TeamOutlined />
                            <span>{car.capacity || "-"} Seats</span>
                          </div>
                          <div className="car-hover-spec">
                            <ThunderboltOutlined />
                            <span>{car.fuelType || "N/A"}</span>
                          </div>
                          <div className="car-hover-spec">
                            <ClockCircleOutlined />
                            <span>₹{Number(car.rentPerHour || 0).toLocaleString("en-IN")}/hr</span>
                          </div>
                        </div>

                        {selectedRange && <Tag
                          className="availability-tag"
                          color={available ? "green" : "red"}
                        >
                          {available ? "Available for your dates" : "Booked"}
                        </Tag>}

                        {/* Category badge */}
                        {category && (
                          <div
                            className="car-category-badge"
                            style={{ background: category.color }}
                          >
                            {category.label}
                          </div>
                        )}

                        <div className="car-floating-price">
                          ₹{Number(car.rentPerHour || 0).toLocaleString("en-IN")}
                          <small>/hr</small>
                        </div>
                      </div>
                    }
                  >
                    <div className="car-card-content">
                      <div className="car-card-top">
                        <div className="car-title-area">
                          <Title
                            level={3}
                            className="car-name"
                            title={car.name}
                          >
                            {car.name}
                          </Title>

                          <Text className="car-category-text">
                            {car.location || "Pickup details on booking"} · {car.transmission || "Transmission not specified"}
                          </Text>
                        </div>

                        <div className="car-specification-grid">
                          <div className="car-specification">
                            <div className="specification-icon">
                              <TeamOutlined />
                            </div>

                            <div className="specification-text">
                              <small>Capacity</small>
                              <strong>
                                {car.capacity || "-"} Seats
                              </strong>
                            </div>
                          </div>

                          <div className="car-specification">
                            <div className="specification-icon">
                              <ThunderboltOutlined />
                            </div>

                            <div className="specification-text">
                              <small>Fuel Type</small>
                              <strong>
                                {car.fuelType || "Not specified"}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="car-card-bottom">
                        <div className="car-price-row">
                          <div>
                            <Text type="secondary">
                              Rental price
                            </Text>

                            <div className="car-price">
                              ₹
                              {Number(
                                car.rentPerHour || 0
                              ).toLocaleString("en-IN")}

                              <small>/hour</small>
                            </div>
                          </div>

                          <div className="car-status-circle">
                            <CarOutlined />
                          </div>
                        </div>

                        <Link
                          to={`/booking/${car._id}${selectedRange ? `?from=${selectedRange[0]}&to=${selectedRange[1]}` : ""}`}
                          className="full-width-link"
                        >
                          <Button
                            type="primary"
                            size="large"
                            block
                            icon={<CarOutlined />}
                            disabled={
                              selectedRange && !available
                            }
                            className="car-booking-button"
                          >
                            {selectedRange && !available
                              ? "Not Available"
                              : "View & Book"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </section>

      {/* How It Works */}
      <section id="rental-guide" className="how-it-works-section">
        <div className="centered-section-heading">
          <Text className="section-label">
            SIMPLE PROCESS
          </Text>

          <Title level={2}>
            How DriveEase works
          </Title>

          <Paragraph>
            Getting on the road has never been easier.
            Follow these three simple steps.
          </Paragraph>
        </div>

        <div className="how-it-works-steps">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div className="how-step-card" data-reveal key={step.step}>
              <div className="how-step-number">{step.step}</div>
              <div className="how-step-icon">{step.icon}</div>
              <Title level={4}>{step.title}</Title>
              <Paragraph>{step.desc}</Paragraph>
              {i < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="how-step-connector" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="centered-section-heading">
          <Text className="section-label">
            WHY DRIVEEASE
          </Text>

          <Title level={2}>
            A better way to rent your next car
          </Title>

          <Paragraph>
            Reliable vehicles, transparent pricing and an easy
            booking experience.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col lg={8} md={12} xs={24}>
            <Card className="feature-card" bordered={false}>
              <SafetyCertificateOutlined />

              <Title level={4}>
                Safe and Reliable
              </Title>

              <Paragraph>
                Every booking is securely processed and your data
                is protected.
              </Paragraph>
            </Card>
          </Col>

          <Col lg={8} md={12} xs={24}>
            <Card className="feature-card" bordered={false}>
              <ThunderboltOutlined />

              <Title level={4}>
                Fast Booking
              </Title>

              <Paragraph>
                Select your vehicle and complete your booking in a
                few simple steps.
              </Paragraph>
            </Card>
          </Col>

          <Col lg={8} md={12} xs={24}>
            <Card className="feature-card" bordered={false}>
              <ClockCircleOutlined />

              <Title level={4}>
                Flexible Rentals
              </Title>

              <Paragraph>
                Select the rental duration according to your exact
                travel requirements.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </section>

      {/* FAQ Section */}
      <section id="rental-faq" className="faq-section">
        <div className="centered-section-heading">
          <Text className="section-label">
            GOT QUESTIONS?
          </Text>

          <Title level={2}>
            Frequently Asked Questions
          </Title>

          <Paragraph>
            Everything you need to know about renting, booking and
            listing your car on DriveEase.
          </Paragraph>
        </div>

        <div className="faq-container">
          <Collapse
            accordion
            bordered={false}
            className="faq-collapse"
            expandIcon={({ isActive }) => (
              <QuestionCircleOutlined
                style={{
                  fontSize: 18,
                  color: isActive ? "#2563eb" : "#64748b",
                  transition: "color 0.2s",
                }}
              />
            )}
          >
            {FAQ_ITEMS.map((item) => (
              <Panel
                key={item.key}
                header={item.label}
                className="faq-panel"
              >
                <p>{item.children}</p>
              </Panel>
            ))}
          </Collapse>
        </div>
      </section>

      <CustomerReviews />
      </div>
    </DefaultLayout>
  );
}

export default Home;
