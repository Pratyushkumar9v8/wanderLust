const Booking = require('../models/booking');
const Listing = require('../models/listing');
const ExpressError = require("../utils/ExpressError"); // ADD this if not present

module.exports.newBook=async (req, res) => {
  const listing = await Listing.findById(req.params.listingId);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
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
      res.redirect(`/bookings/${req.body.listingId}/new`);
    }
}

module.exports.showUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.render("bookings/userBookings", { bookings });
};

module.exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    req.flash("error", "Booking not found.");
    return res.redirect("/bookings/userBookings");
  }

  // Ensure user owns the booking
  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You are not authorized to cancel this booking.");
    return res.redirect("/bookings/userBookings");
  }
  
  const now = new Date();
  const timeDifference = booking.startDate.getTime() - now.getTime();
  const hoursRemaining = timeDifference / (1000 * 60 * 60); // milliseconds → hours

  if (hoursRemaining < 24) {
    req.flash("error", "Cancellations are only allowed at least 24 hours before the check-in date.");
    return res.redirect("/my-bookings");
  }

  await Booking.findByIdAndDelete(id);
  req.flash("success", "Booking cancelled successfully.");
  res.redirect("/bookings/userBookings");
}

module.exports.terms = (req, res) => {
  res.render("bookings/terms");
}