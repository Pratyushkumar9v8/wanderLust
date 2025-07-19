const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require('../schema.js');
const Listing = require('../models/listing');
const {isLoggedIn, isOwner,validateListing,validateReview} = require("../middleware.js");
const multer = require('multer');
const {storage}=require("../cloudConfig.js");

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: function (req, file, next) {
    const allowedTypes = /jpeg|jpg|png/;
    const isValid = allowedTypes.test(file.mimetype);
    if (isValid) {
      next(null, true);
    } else {
      next(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only JPG, JPEG, PNG files are allowed!'));
    }
  },
});



 

const listingController= require("../controllers/listings.js");

router
    .route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.create));

router.get('/new',isLoggedIn,listingController.new);
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.getEdit));

router
   .route('/:id')
   .get( wrapAsync(listingController.show))
   .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,  wrapAsync(listingController.update))
   .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroy));

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      req.flash('error', 'Image exceeds 2MB size limit.');
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      req.flash('error', 'Only JPG, JPEG, PNG image formats are allowed.');
    } else {
      req.flash('error', err.message);
    }
    return res.redirect('/listings/new');
  }
  next(err);
});



module.exports = router;