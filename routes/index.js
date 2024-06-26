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
    // console.log(movies);
    res.render("dashboard", {
      name: req.user.firstName,
      movies,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

//@desc Show add page
//@route GET /stories/add
router.get("/search", ensureAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const options = {
      headers: {
        method: "GET",
        accept: "application/json",
        Authorization:
          `Bearer ${process.env.API_READ_ACCESS_TOKEN}`,
      },
    };
    const movieTitle = req.query.title;
    const dbMovies = await Movie.aggregate([
      {
        $search: {
          text: {
            query: movieTitle,
            path: "title",
          },
        },
      },
      {
        $limit: 5,
      },
    ]);
    const movies = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movieTitle}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        data.results.forEach((movie) => {
          dbMovies.forEach((dbMovie) => {
            if (movie.id == dbMovie.id) {
              data.results.shift(movie);
            }
          });
        });
        return data.results;
      });

    res.render("search", {
      dbMovies: dbMovies,
      movies: movies,
      userId: userId,
    });
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

module.exports = router;
