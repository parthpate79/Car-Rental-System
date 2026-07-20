import React, { useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../redux/actions/bookingActions";
import { Col, Row } from "antd";
import Spinner from "../components/Spinner";
import moment from "moment";

function UserBookings() {
  const dispatch = useDispatch();

  const { bookings = [] } = useSelector(
    (state) => state.bookingsReducer
  );

  const { loading } = useSelector(
    (state) => state.alertsReducer
  );

  const user = JSON.parse(localStorage.getItem("user"));
console.log("Current User:", user);
  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  // Debug (remove later)
  console.log("Logged In User:", user);
  console.log("Bookings:", bookings);

  const userBookings = bookings.filter(
    (booking) =>
      booking.user === user?._id ||
      booking.user?._id === user?._id
  );

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <h3 className="text-center mt-2">My Bookings</h3>

      <Row justify="center">
        <Col lg={18} sm={24}>

          {userBookings.length === 0 ? (
            <div className="text-center mt-5">
              <h4>No Bookings Found</h4>
            </div>
          ) : (
            userBookings.map((booking) => (
              <Row
                gutter={16}
                className="bs1 mt-3"
                key={booking._id}
              >
                <Col lg={6} sm={24}>
                  <p>
                    <b>{booking.car?.name || "Car Name"}</b>
                  </p>

                  <p>
                    Total Hours :
                    <b> {booking.totalHours}</b>
                  </p>

                  <p>
                    Rent Per Hour :
                    <b> ₹{booking.car?.rentPerHour}</b>
                  </p>

                  <p>
                    Total Amount :
                    <b> ₹{booking.totalAmount}</b>
                  </p>
                </Col>

                <Col lg={12} sm={24}>
                  <p>
                    Transaction ID :
                    <b> {booking.transactionId}</b>
                  </p>

                  <p>
                    From :
                    <b> {booking.bookedTimeSlots?.from}</b>
                  </p>

                  <p>
                    To :
                    <b> {booking.bookedTimeSlots?.to}</b>
                  </p>

                  <p>
                    Date :
                    <b>
                      {" "}
                      {booking.createdAt
                        ? moment(booking.createdAt).format(
                            "MMM DD YYYY"
                          )
                        : "-"}
                    </b>
                  </p>
                </Col>

                <Col lg={6} sm={24} className="text-right">
                  {booking.car?.image ? (
                    <img
                      src={booking.car.image}
                      alt={booking.car.name}
                      height="140"
                      width="200"
                      style={{
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                </Col>
              </Row>
            ))
          )}

        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default UserBookings;