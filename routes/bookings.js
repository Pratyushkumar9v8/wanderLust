const express = require("express");
const router = express.Router();
const Booking = require("../models/booking").default;
const Listing = require("../models/listing").default;
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/bookings");

// Render booking page
router.get("/:listingId/new", isLoggedIn, bookingController.newBook);

// Handle booking submission
router.post("/", isLoggedIn, bookingController.createBooking);

router.get("/userBookings", isLoggedIn, bookingController.showUserBookings);

module.exports = router;
