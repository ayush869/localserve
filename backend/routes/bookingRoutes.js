const express = require("express");

const router = express.Router();

const {
  createBooking,
  getProviderBookings,
  getCustomerBookings,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/bookingController");


// Create booking
router.post("/", createBooking);


// Provider bookings
router.get("/provider/:providerId", getProviderBookings);


// Customer bookings
router.get("/customer/:customerId", getCustomerBookings);


// Update booking status
router.put("/:id/status", updateBookingStatus);

router.put("/:id/cancel", cancelBooking);


module.exports = router;