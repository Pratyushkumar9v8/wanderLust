const express = require("express");
const router = express.Router();
const Booking = require("../models/booking").default;
const Listing = require("../models/listing").default;
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/bookings");

router.get("/:listingId/new", isLoggedIn, bookingController.newBook);

router.post("/", isLoggedIn, bookingController.createBooking);

router.get("/userBookings", isLoggedIn, bookingController.showUserBookings);

router.get("/terms", bookingController.terms);

router.delete("/:id", isLoggedIn, bookingController.deleteBooking);

module.exports = router;
