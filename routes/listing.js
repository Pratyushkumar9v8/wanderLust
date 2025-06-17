const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require('../schema.js');
const Listing = require('../models/listing');
const {isLoggedIn, isOwner,validateListing,validateReview} = require("../middleware.js");
const multer = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


 

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
        req.flash('error', err.message);
        return res.redirect('back');
    }
    next(err);
    });


module.exports = router;