const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require('../schema.js');
const Review = require("../models/review.js");
const Listing = require('../models/listing.js');
const {validateReview, isLoggedIn,isAuthor} = require("../middleware.js");

const listingController= require("../controllers/review.js");


// add reviews
router.post('/',isLoggedIn,validateReview,wrapAsync(listingController.add));

// delete reviews
router.delete('/:reviewId',isAuthor,wrapAsync(listingController.destroy));

module.exports = router;
