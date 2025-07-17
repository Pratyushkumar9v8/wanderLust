const express = require("express");
const router = express.Router();


router.get("/contact", (req, res) => {
  res.render("partials/contact");
});
router.get("/about", (req, res) => {
  res.render("partials/about");
});
router.get("/privacy", (req, res) => {
  res.render("partials/privacy");
});
router.get("/press", (req, res) => {
  res.render("partials/press");
});

module.exports = router;
