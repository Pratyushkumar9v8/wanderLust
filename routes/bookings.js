const express = require("express");
const router = express.Router();
const Booking = require("../models/booking").default;
const Listing = require("../models/listing").default;
const { isLoggedIn } = require("../middleware");
const listingController= require("../controllers/bookings.js");

// Render booking page
router.get("/:listingId/new", isLoggedIn, listingController.newBook);

// Handle booking submission
router.post("/", isLoggedIn, listingController.createBooking);

module.exports = router;
