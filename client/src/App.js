import "./App.css";
import React from "react";

import {
  createBrowserRouter,
  Navigate,
  useLocation,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingCar from "./pages/BookingCar";
import BookingSuccess from "./pages/BookingSuccess";
import UserBookings from "./pages/UserBookings";
import AddCar from "./pages/AddCar";
import AdminHome from "./pages/AdminHome";
import EditCar from "./pages/EditCar";
import ListYourCar from "./pages/ListYourCar";
import MyCarListings from "./pages/MyCarListings";
import AdminCarRequests from "./pages/AdminCarRequests";
import OwnerEarnings from "./pages/OwnerEarnings";
import AdminRevenue from "./pages/AdminRevenue";

const getStoredUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return null;
  }
};

export const ProtectedRoute = ({
  children,
}) => {
  const location = useLocation();
  const user = getStoredUser();
  const token =
    localStorage.getItem("token");

  if (!user || !token) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  return children;
};

export const AdminRoute = ({
  children,
}) => {
  const location = useLocation();
  const user = getStoredUser();
  const token =
    localStorage.getItem("token");

  if (!user || !token) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`}
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

  return children;
};

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-icon">
        <span>🚗</span>
        <div className="not-found-road" />
      </div>

      <div className="not-found-badge">404</div>

      <h1 className="not-found-title">
        Oops! Wrong turn taken.
      </h1>

      <p className="not-found-desc">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on the right road.
      </p>

      <div className="not-found-actions">
        <button
          className="not-found-primary-btn"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          🏠 Return Home
        </button>

        <button
          className="not-found-secondary-btn"
          onClick={() => window.history.back()}
        >
          ← Go Back
        </button>
      </div>

      <p className="not-found-help">
        Need help?{" "}
        <a href="/">
          Explore available cars
        </a>
      </p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",

    element: (
      <Home />
    ),
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/booking/:carid",

    element: (
      <ProtectedRoute>
        <BookingCar />
      </ProtectedRoute>
    ),

    loader: ({ params }) =>
      params.carid,
  },

  {
    path: "/booking-success/:bookingId",

    element: (
      <ProtectedRoute>
        <BookingSuccess />
      </ProtectedRoute>
    ),
  },

  {
    path: "/userbookings",

    element: (
      <ProtectedRoute>
        <UserBookings />
      </ProtectedRoute>
    ),
  },

  {
    path: "/list-your-car",

    element: (
      <ProtectedRoute>
        <ListYourCar />
      </ProtectedRoute>
    ),
  },
{
  path: "/edit-car-listing/:requestId",

  element: (
    <ProtectedRoute>
      <ListYourCar />
    </ProtectedRoute>
  ),
},
  {
    path: "/my-car-listings",

    element: (
      <ProtectedRoute>
        <MyCarListings />
      </ProtectedRoute>
    ),
  },

  {
    path: "/addcar",

    element: (
      <AdminRoute>
        <AddCar />
      </AdminRoute>
    ),
  },

  {
    path: "/editcar/:carid",

    element: (
      <AdminRoute>
        <EditCar />
      </AdminRoute>
    ),

    loader: ({ params }) =>
      params.carid,
  },

  {
    path: "/admin",

    element: (
      <AdminRoute>
        <AdminHome />
      </AdminRoute>
    ),
  },

  {
    path: "/admin/car-requests",

    element: (
      <AdminRoute>
        <AdminCarRequests />
      </AdminRoute>
    ),
  },{
  path: "/owner-earnings",
  element: (
    <ProtectedRoute>
      <OwnerEarnings />
    </ProtectedRoute>
  ),
},
{
  path: "/admin/revenue",
  element: (
    <AdminRoute>
      <AdminRevenue />
    </AdminRoute>
  ),
},

  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider
        router={router}
      />
    </div>
  );
}

export default App;
