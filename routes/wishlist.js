const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const wishlist = require('../controllers/wishlist');

router.get('/wishlist', isLoggedIn,wishlist.wish );

router.post('/wishlist/:id/toggle', isLoggedIn, wishlist.toggleWishlist);

module.exports = router;
