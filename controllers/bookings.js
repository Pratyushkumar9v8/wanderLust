const Booking = require('../models/booking');
const Listing = require('../models/listing');
const ExpressError = require("../utils/ExpressError"); // ADD this if not present

module.exports.newBook=async (req, res) => {
  const listing = await Listing.findById(req.params.listingId);
  res.render("bookings/new", { listing });
}
module.exports.createBooking = async (req, res) => {
  try {
    const { listingId, dates } = req.body;
    const [startDateStr, endDateStr] = dates.split(" to ");
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const listing = await Listing.findById(listingId);

    // Conflict check
    const conflict = listing.bookedDates.some(date => {
      const d = new Date(date);
      return d >= startDate && d <= endDate;
    });

    if (conflict) {
      req.flash("error", "Selected dates are not available.");
      return res.redirect(`/bookings/${listingId}/new`);
    }

    // Save booking
    const booking = new Booking({
      user: req.user._id,
      listing: listingId,
      startDate,
      endDate
    });
    await booking.save();

    // Update bookedDates
    let pointer = new Date(startDate);
    while (pointer <= endDate) {
      listing.bookedDates.push(new Date(pointer));
      pointer.setDate(pointer.getDate() + 1);
    }
    await listing.save();

    req.flash("success", "Booking confirmed!");
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    res.redirect("back");
  }
}