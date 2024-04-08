const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Movie = require("../models/Movie");

//@desc Login/Landing Page
//@route GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("login", { layout: "login" });
});
//@desc Dashboard
//@route GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const movies = await Movie.aggregate([
      { $sample: { size: 5 } },
      { $match: { status: "Not Watched" } },
    ]);
    console.log(movies);
    res.render("dashboard", {
      name: req.user.firstName,
      movies,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

module.exports = router;
