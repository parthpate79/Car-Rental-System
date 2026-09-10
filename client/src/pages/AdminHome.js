import { isBookedNow } from "../utils/rental";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Button,
  Card,
  Empty,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

import {
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileProtectOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  Link,
  Navigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import AdminLayout from "../components/AdminLayout";
import AdminPageHero from "../components/AdminPageHero";
import Spinner from "../components/Spinner";

import {
  deleteCar,
  getAllCars,
} from "../redux/actions/carsActions";

const {
  Title,
  Text,
} = Typography;

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString(
    "en-IN"
  );

function AdminHome() {
  const dispatch = useDispatch();

  const carsState = useSelector(
    (state) => state.carsReducer
  );

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading || false
  );

  const cars = useMemo(
    () =>
      Array.isArray(carsState?.cars)
        ? carsState.cars
        : [],
    [carsState?.cars]
  );

  const [searchText, setSearchText] =
    useState("");

  const [fuelFilter, setFuelFilter] =
    useState("all");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  const loadCars = useCallback(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const fuelOptions = useMemo(() => {
    const fuelTypes = [
      ...new Set(
        cars
          .map((car) => car.fuelType)
          .filter(Boolean)
      ),
    ];

    return fuelTypes.map((fuelType) => ({
      label: fuelType,
      value: fuelType,
    }));
  }, [cars]);

  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (searchText.trim()) {
      const query = searchText
        .trim()
        .toLowerCase();

      result = result.filter((car) => {
        const name =
          car.name?.toLowerCase() || "";

        const brand =
          car.brand?.toLowerCase() || "";

        const model =
          car.model?.toLowerCase() || "";

        const fuelType =
          car.fuelType?.toLowerCase() || "";

        return (
          name.includes(query) ||
          brand.includes(query) ||
          model.includes(query) ||
          fuelType.includes(query)
        );
      });
    }

    if (fuelFilter !== "all") {
      result = result.filter(
        (car) =>
          car.fuelType === fuelFilter
      );
    }

    return result;
  }, [
    cars,
    searchText,
    fuelFilter,
  ]);

  const bookedCars = useMemo(
    () =>
      cars.filter(
        (car) =>
          isBookedNow(car)
      ).length,
    [cars]
  );

  const availableCars = useMemo(
    () =>
      Math.max(
        cars.length - bookedCars,
        0
      ),
    [cars.length, bookedCars]
  );

  const totalBookedSlots = useMemo(
    () =>
      cars.reduce(
        (total, car) =>
          total +
          (Array.isArray(
            car.bookedTimeSlots
          )
            ? car.bookedTimeSlots.length
            : 0),
        0
      ),
    [cars]
  );

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.isAdmin !== true) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const handleDelete = async (carId) => {
    await dispatch(
      deleteCar({
        carid: carId,
      })
    );
  };

  const resetFilters = () => {
    setSearchText("");
    setFuelFilter("all");
  };

  const columns = [
    {
      title: "Vehicle",
      key: "car",
      width: 320,

      render: (_, car) => (
        <div className="admin-table-car">
          <img
            src={
              car.image ||
              "https://placehold.co/150x100?text=DriveEase"
            }
            alt={car.name || "Rental car"}
          />

          <div>
            <strong>
              {car.name || "Unnamed Car"}
            </strong>

            <span>
              {car.capacity || "-"} Seats
              {" • "}
              {car.fuelType || "Unknown Fuel"}
            </span>
          </div>
        </div>
      ),
    },

    {
      title: "Fuel",
      dataIndex: "fuelType",
      key: "fuelType",
      width: 120,

      render: (fuelType) => (
        <Tag color="blue">
          {fuelType || "Unknown"}
        </Tag>
      ),
    },

    {
      title: "Capacity",
      sorter: (a, b) => Number(a.capacity) - Number(b.capacity),
      dataIndex: "capacity",
      key: "capacity",
      width: 120,

      render: (capacity) => (
        <span>
          {capacity || "-"} Seats
        </span>
      ),
    },

    {
      title: "Rental Price",
      sorter: (a, b) => Number(a.rentPerHour) - Number(b.rentPerHour),
      dataIndex: "rentPerHour",
      key: "rentPerHour",
      width: 150,

      render: (rentPerHour) => (
        <strong>
          ₹{formatMoney(rentPerHour)}
          /hour
        </strong>
      ),
    },

    {
      title: "Booked Slots",
      key: "bookings",
      width: 120,

      render: (_, car) => {
        const bookingCount =
          Array.isArray(
            car.bookedTimeSlots
          )
            ? car.bookedTimeSlots.length
            : 0;

        return (
          <Tag
            color={
              bookingCount > 0
                ? "orange"
                : "default"
            }
          >
            {bookingCount}
          </Tag>
        );
      },
    },

    {
      title: "Availability now",
      key: "status",
      width: 145,

      render: (_, car) => {
        const hasBookings =
          isBookedNow(car);

        return (
          <Tag
            icon={
              hasBookings ? (
                <ClockCircleOutlined />
              ) : (
                <CheckCircleOutlined />
              )
            }
            color={
              hasBookings
                ? "orange"
                : "green"
            }
          >
            {hasBookings
              ? "On rent now"
              : "Available"}
          </Tag>
        );
      },
    },

    {
      title: "Actions",
      key: "actions",
      width: 190,
      fixed: "right",

      render: (_, car) => (
        <Space>
          <Link
            to={`/editcar/${car._id}`}
          >
            <Button
              icon={<EditOutlined />}
              className="admin-table-edit-button"
            >
              Edit
            </Button>
          </Link>

          <Popconfirm
            title="Delete this car?"
            description="This vehicle will be permanently removed from DriveEase."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
            }}
            onConfirm={() =>
              handleDelete(car._id)
            }
          >
            <Button
              danger
              aria-label={`Delete ${car.name}`}
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      {loading && <Spinner />}

      <section className="admin-dashboard-page">
        {carsState.error && <Alert type="warning" showIcon message="Fleet data could not be refreshed" description="Displayed vehicles may be out of date. Try refreshing again." style={{ marginBottom: 20 }} action={<Button onClick={loadCars}>Retry</Button>} />}
        <AdminPageHero
          eyebrow="FLEET MANAGEMENT"
          title="Manage Rental Vehicles"
          description="View, add, update and remove DriveEase rental vehicles while monitoring availability and active booking slots."
          icon={<CarOutlined />}
          theme="blue"
          actions={
            <>
              <Link to="/admin/car-requests">
                <Button
                  size="large"
                  icon={
                    <FileProtectOutlined />
                  }
                >
                  Owner Requests
                </Button>
              </Link>

              <Button
                size="large"
                icon={<ReloadOutlined />}
                onClick={loadCars}
              >
                Refresh
              </Button>

              <Link to="/addcar">
                <Button
                  type="primary"
                  size="large"
                  icon={
                    <PlusCircleOutlined />
                  }
                >
                  Add New Car
                </Button>
              </Link>
            </>
          }
          stats={[
            {
              label: "Total Cars",
              value: cars.length,
              icon: <CarOutlined />,
            },
            {
              label: "Available Now",
              value: availableCars,
              icon:
                <CheckCircleOutlined />,
            },
            {
              label: "On Rent Now",
              value: bookedCars,
              icon:
                <ClockCircleOutlined />,
            },
            {
              label: "Total Booked Slots",
              value: totalBookedSlots,
              icon:
                <FileProtectOutlined />,
            },
          ]}
        />

        <Card
          bordered={false}
          className="admin-table-container"
        >
          <div className="admin-table-toolbar">
            <div>
              <Title level={3}>
                Vehicle Inventory
              </Title>

              <Text type="secondary">
                Showing{" "}
                {filteredCars.length} of{" "}
                {cars.length} vehicles
              </Text>
            </div>

            <Space wrap>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search by name, brand, model or fuel"
                allowClear
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value
                  )
                }
                className="admin-table-search"
              />

              <Select
                value={fuelFilter}
                onChange={setFuelFilter}
                suffixIcon={
                  <FilterOutlined />
                }
                className="admin-table-filter"
                options={[
                  {
                    label:
                      "All Fuel Types",
                    value: "all",
                  },
                  ...fuelOptions,
                ]}
              />

              {(searchText ||
                fuelFilter !== "all") && (
                <Button
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              )}
            </Space>
          </div>

          {filteredCars.length === 0 ? (
            <Empty
              description={
                cars.length === 0
                  ? "No vehicles have been added yet"
                  : "No vehicles match the selected filters"
              }
              className="admin-table-empty"
            >
              {cars.length === 0 ? (
                <Link to="/addcar">
                  <Button
                    type="primary"
                    icon={
                      <PlusCircleOutlined />
                    }
                  >
                    Add First Car
                  </Button>
                </Link>
              ) : (
                <Button
                  type="primary"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              )}
            </Empty>
          ) : (
            <Table
              rowKey="_id"
              columns={columns}
              dataSource={filteredCars}
              loading={loading}
              pagination={{
                pageSize: 6,
                showSizeChanger: false,
                showTotal: (
                  total,
                  range
                ) =>
                  `${range[0]}-${range[1]} of ${total} vehicles`,
              }}
              scroll={{
                x: 1150,
              }}
              className="admin-cars-table"
            />
          )}
        </Card>
      </section>
    </AdminLayout>
  );
}

export default AdminHome;
