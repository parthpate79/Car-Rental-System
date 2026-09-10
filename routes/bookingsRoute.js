const express = require("express");
const mongoose = require("mongoose");

const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

const DRIVER_RATE_PER_HOUR = 30;
const SERVICE_FEE_PERCENTAGE = 3;

// ============================================
// CREATE BOOKING
// ============================================

router.post("/bookcar", protect, async (req, res) => {
  try {
    const {
      car: carId,
      bookedTimeSlots,
      driverRequired = false,
      paymentMethod = "pay_at_pickup",
      token = null,
    } = req.body;

    if (
      !carId ||
      !mongoose.Types.ObjectId.isValid(carId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID",
      });
    }

    if (
      !bookedTimeSlots?.from ||
      !bookedTimeSlots?.to
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select pickup and return time",
      });
    }

    const from = new Date(bookedTimeSlots.from);
    const to = new Date(bookedTimeSlots.to);
    const currentTime = new Date();

    if (
      Number.isNaN(from.getTime()) ||
      Number.isNaN(to.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup or return date",
      });
    }

    if (from.getTime() < currentTime.getTime()) {
      return res.status(400).json({
        success: false,
        message: "Pickup time cannot be in the past",
      });
    }

    if (to.getTime() <= from.getTime()) {
      return res.status(400).json({
        success: false,
        message:
          "Return time must be after pickup time",
      });
    }

    const durationInMilliseconds =
      to.getTime() - from.getTime();

    const totalHours = Math.ceil(
      durationInMilliseconds / (1000 * 60 * 60)
    );

    if (totalHours < 1) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum booking duration is one hour",
      });
    }

    const selectedCar = await Car.findById(carId);

    if (!selectedCar || selectedCar.isActive === false || selectedCar.isPublic === false) {
      return res.status(404).json({
        success: false,
        message: "Selected car was not found",
      });
    }

    const bookedSlots = Array.isArray(
      selectedCar.bookedTimeSlots
    )
      ? selectedCar.bookedTimeSlots
      : [];

    const bookingConflict = bookedSlots.some(
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
          from.getTime() < existingTo &&
          to.getTime() > existingFrom
        );
      }
    );

    if (bookingConflict) {
      return res.status(409).json({
        success: false,
        message:
          "This car is already booked during the selected period",
      });
    }

    const rentPerHour = Number(
      selectedCar.rentPerHour
    );

    const baseAmount =
      totalHours * rentPerHour;

    const driverCharge = driverRequired
      ? totalHours * DRIVER_RATE_PER_HOUR
      : 0;

    const subtotal =
      baseAmount + driverCharge;

    const serviceFee = Math.round(
      subtotal *
        (SERVICE_FEE_PERCENTAGE / 100)
    );

    const totalAmount =
      subtotal + serviceFee;

      const commissionRate =
  selectedCar.listingType === "owner"
    ? Number(selectedCar.commissionRate || 10)
    : 0;

const platformCommission =
  selectedCar.listingType === "owner"
    ? Math.round(
        baseAmount * (commissionRate / 100)
      )
    : 0;

const ownerEarning =
  selectedCar.listingType === "owner"
    ? baseAmount - platformCommission
    : 0;

    if (typeof driverRequired !== "boolean") {
      return res.status(400).json({ success: false, message: "Invalid driver option" });
    }
    if (paymentMethod !== "pay_at_pickup") {
      return res.status(400).json({ success: false, message: "Online payments are not available. Please choose Pay at Pickup." });
    }
    const selectedPaymentMethod = "pay_at_pickup";
    const paymentStatus = "pending";
    const transactionId = "";

    const newBooking = await Booking.create({
      car: selectedCar._id,
      user: req.user._id,

      carOwner:
        selectedCar.listingType === "owner"
          ? selectedCar.owner
            : null,

      bookedTimeSlots: {
        from,
        to,
      },

      totalHours,
      rentPerHour,
      baseAmount,

      driverRequired: Boolean(driverRequired),
      driverCharge,
      serviceFee,

      commissionRate,
      platformCommission,
      ownerEarning,

      totalAmount,

      paymentMethod: selectedPaymentMethod,
      paymentStatus,
      bookingStatus: "confirmed",

      payoutStatus:
        selectedCar.listingType === "owner"
          ? "pending"
          : "not_applicable",

      transactionId,
    });

    selectedCar.bookedTimeSlots.push({
      from,
      to,
      booking: newBooking._id,
    });

    await selectedCar.save();

    const populatedBooking =
      await Booking.findById(newBooking._id)
        .populate("car")
        .populate("user", "username isAdmin");

    return res.status(201).json({
      success: true,

      message:
        selectedPaymentMethod === "pay_at_pickup"
          ? "Booking confirmed. Payment will be collected at pickup."
          : "Payment successful and booking confirmed.",

      data: {
        booking: populatedBooking,
      },
    });
  } catch (error) {
    console.error("BOOK CAR ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to complete the booking",
    });
  }
});

// ============================================
// GET ALL BOOKINGS
// ============================================

router.get(
  "/getallbookings",
  protect,
  async (req, res) => {
    try {
      const query = req.user.isAdmin
        ? {}
        : { user: req.user._id };

      const bookings = await Booking.find(query)
        .populate("car")
        .populate("user", "username isAdmin")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: {
          bookings,
        },
      });
    } catch (error) {
      console.error(
        "GET BOOKINGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to load bookings",
      });
    }
  }
);

// ============================================
// GET ONE BOOKING
// ============================================

router.get(
  "/:bookingId",
  protect,
  async (req, res) => {
    try {
      const { bookingId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          bookingId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
        });
      }

      const booking = await Booking.findById(
        bookingId
      )
        .populate("car")
        .populate("user", "username isAdmin");

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      const bookingUserId =
        booking.user?._id?.toString();

      const loggedInUserId =
        req.user._id.toString();

      if (
        req.user.isAdmin !== true &&
        bookingUserId !== loggedInUserId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You cannot access this booking",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          booking,
        },
      });
    } catch (error) {
      console.error(
        "GET BOOKING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load booking details",
      });
    }
  }
);

// ============================================
// USER CANCEL BOOKING
// ============================================

router.patch(
  "/:bookingId/cancel",
  protect,
  async (req, res) => {
    try {
      const { bookingId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          bookingId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
        });
      }

      const booking = await Booking.findById(
        bookingId
      );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      const isBookingOwner =
        booking.user.toString() ===
        req.user._id.toString();

      if (
        !isBookingOwner &&
        req.user.isAdmin !== true
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You cannot cancel this booking",
        });
      }

      if (
        booking.bookingStatus === "cancelled"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Booking is already cancelled",
        });
      }

      if (
        booking.bookingStatus === "completed"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Completed booking cannot be cancelled",
        });
      }

      const pickupTime = new Date(
        booking.bookedTimeSlots.from
      );

      if (pickupTime.getTime() <= Date.now()) {
        return res.status(400).json({
          success: false,
          message:
            "Booking cannot be cancelled after pickup time",
        });
      }

      booking.bookingStatus = "cancelled";

      if (booking.paymentStatus === "paid") {
        booking.paymentStatus = "refunded";
      }

      await booking.save();

      await Car.findByIdAndUpdate(
        booking.car,
        {
          $pull: {
            bookedTimeSlots: {
              booking: booking._id,
            },
          },
        }
      );

      const updatedBooking =
        await Booking.findById(booking._id)
          .populate("car")
          .populate(
            "user",
            "username isAdmin"
          );

      return res.status(200).json({
        success: true,
        message:
          "Booking cancelled successfully",

        data: {
          booking: updatedBooking,
        },
      });
    } catch (error) {
      console.error(
        "CANCEL BOOKING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to cancel booking",
      });
    }
  }
);

// ============================================
// ADMIN UPDATE BOOKING STATUS
// ============================================

router.patch(
  "/:bookingId/status",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { bookingStatus } = req.body;

      const allowedStatuses = [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
      ];

      if (
        !allowedStatuses.includes(
          bookingStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking status",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.bookingId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
        });
      }

      const booking = await Booking.findById(
        req.params.bookingId
      );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      booking.bookingStatus =
        bookingStatus;

      await booking.save();

      return res.status(200).json({
        success: true,
        message:
          "Booking status updated successfully",

        data: {
          booking,
        },
      });
    } catch (error) {
      console.error(
        "UPDATE BOOKING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update booking status",
      });
    }
  }
);

// ============================================
// OWNER: GET OWNER EARNINGS
// ============================================

router.get(
  "/owner/earnings",
  protect,
  async (req, res) => {
    try {
      const bookings = await Booking.find({
        carOwner: req.user._id,
      })
        .populate(
          "car",
          "name image brand model registrationNumber"
        )
        .populate(
          "user",
          "username"
        )
        .sort({
          createdAt: -1,
        });

      const validBookings = bookings.filter(
        (booking) =>
          booking.bookingStatus !== "cancelled"
      );

      const totalBookings =
        validBookings.length;

      const totalOwnerEarning =
        validBookings.reduce(
          (total, booking) =>
            total +
            Number(
              booking.ownerEarning || 0
            ),
          0
        );

      const totalCommission =
        validBookings.reduce(
          (total, booking) =>
            total +
            Number(
              booking.platformCommission ||
                0
            ),
          0
        );

      const pendingPayout =
        validBookings
          .filter(
            (booking) =>
              booking.payoutStatus ===
                "pending" ||
              booking.payoutStatus ===
                "processing"
          )
          .reduce(
            (total, booking) =>
              total +
              Number(
                booking.ownerEarning || 0
              ),
            0
          );

      const paidPayout =
        validBookings
          .filter(
            (booking) =>
              booking.payoutStatus === "paid"
          )
          .reduce(
            (total, booking) =>
              total +
              Number(
                booking.ownerEarning || 0
              ),
            0
          );

      return res.status(200).json({
        success: true,

        data: {
          statistics: {
            totalBookings,
            totalOwnerEarning,
            totalCommission,
            pendingPayout,
            paidPayout,
          },

          bookings,
        },
      });
    } catch (error) {
      console.error(
        "OWNER EARNINGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load owner earnings",
      });
    }
  }
);

// ============================================
// ADMIN: GET REVENUE DASHBOARD
// ============================================

router.get(
  "/admin/revenue",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate(
          "car",
          "name image listingType owner"
        )
        .populate(
          "user",
          "username"
        )
        .populate(
          "carOwner",
          "username"
        )
        .sort({
          createdAt: -1,
        });

      const validBookings = bookings.filter(
        (booking) =>
          booking.bookingStatus !== "cancelled"
      );

      const marketplaceBookings =
        validBookings.filter(
          (booking) =>
            booking.carOwner &&
            Number(
              booking.platformCommission || 0
            ) > 0
        );

      const totalBookingRevenue =
        validBookings.reduce(
          (total, booking) =>
            total +
            Number(
              booking.totalAmount || 0
            ),
          0
        );

      const platformCommission =
        marketplaceBookings.reduce(
          (total, booking) =>
            total +
            Number(
              booking.platformCommission ||
                0
            ),
          0
        );

      const ownerEarnings =
        marketplaceBookings.reduce(
          (total, booking) =>
            total +
            Number(
              booking.ownerEarning || 0
            ),
          0
        );

      const pendingPayout =
        marketplaceBookings
          .filter(
            (booking) =>
              booking.payoutStatus ===
                "pending" ||
              booking.payoutStatus ===
                "processing"
          )
          .reduce(
            (total, booking) =>
              total +
              Number(
                booking.ownerEarning || 0
              ),
            0
          );

      const completedPayout =
        marketplaceBookings
          .filter(
            (booking) =>
              booking.payoutStatus === "paid"
          )
          .reduce(
            (total, booking) =>
              total +
              Number(
                booking.ownerEarning || 0
              ),
            0
          );

      return res.status(200).json({
        success: true,

        data: {
          statistics: {
            totalBookings:
              validBookings.length,

            marketplaceBookings:
              marketplaceBookings.length,

            totalBookingRevenue,
            platformCommission,
            ownerEarnings,
            pendingPayout,
            completedPayout,
          },

          bookings,
        },
      });
    } catch (error) {
      console.error(
        "ADMIN REVENUE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load revenue information",
      });
    }
  }
);

// ============================================
// ADMIN: UPDATE OWNER PAYOUT STATUS
// ============================================

router.patch(
  "/admin/:bookingId/payout",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { payoutStatus } = req.body;

      const allowedStatuses = [
        "pending",
        "processing",
        "paid",
      ];

      if (
        !mongoose.Types.ObjectId.isValid(
          bookingId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
        });
      }

      if (
        !allowedStatuses.includes(
          payoutStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payout status",
        });
      }

      const booking =
        await Booking.findById(
          bookingId
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      if (!booking.carOwner) {
        return res.status(400).json({
          success: false,
          message:
            "This is not an owner car booking",
        });
      }

      if (
        booking.bookingStatus ===
        "cancelled"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Cancelled booking cannot be paid",
        });
      }

      booking.payoutStatus =
        payoutStatus;

      await booking.save();

      const updatedBooking =
        await Booking.findById(
          booking._id
        )
          .populate(
            "car",
            "name image"
          )
          .populate(
            "carOwner",
            "username"
          )
          .populate(
            "user",
            "username"
          );

      return res.status(200).json({
        success: true,
        message:
          "Payout status updated successfully",

        data: {
          booking: updatedBooking,
        },
      });
    } catch (error) {
      console.error(
        "UPDATE PAYOUT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update payout status",
      });
    }
  }
);

module.exports = router;