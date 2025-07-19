const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const listingController= require("../controllers/user.js");

router
     .route('/signup')
     .get( listingController.getSignup)
     .post(saveRedirectUrl,wrapAsync( listingController.postSignup));

router
     .route('/login')
     .get(listingController.getLogin)
     .post(saveRedirectUrl, passport.authenticate('local', {failureRedirect: '/user/login',failureFlash: true,}),listingController.postLogin);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/user/login',
    failureFlash: true,
  }),
  (req, res) => {
    req.flash('success', `Welcome, ${req.user.username}`);
    res.redirect('/listings');
  }
); 

router.get('/logout',listingController.logOut );

module.exports = router;
