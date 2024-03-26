const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Movie = require("../models/Movie");

//@desc Show add page
//@route GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("movies/add");
});

router.get("/search", async (req, res) => {
  try {
    let result = await Movie.aggregate([
      {
        $search: {
          index: "movies",
          text: {
            query: req.query.search,
            path: "title",
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3,
            },
          },
        },
      },
    ]).toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send("error/500");
  }
});

router.get("get/:id", async (req, res) => {
  try {
    let result = await Movie.findOne(req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send("error/500");
  }
});
//@desc Show add page
//@route GET /stories/add
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYWIzNGI5MjE3ODlkYThkZjdkZjM5MmU4MjgzYjNjYiIsInN1YiI6IjY1ZDIzZDllNzdjMDFmMDE2MzBmMTZmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.R-rGV16xv7eqDBejauPToooeVKO2uNNWsmei1VEyA6A",
      },
    };
    req.body.user = req.user.id;
    const movieTitle = req.body.title;
    const movies = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movieTitle}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        return data.results;
      });
    console.log(movies);
    res.render("search", { movies: movies });

    // await Movie.create({
    //   title: movie.results[0].title,
    //   release_date: movie.results[0].release_date,
    //   poster_path: movie.results[0].poster_path,
    //   overview: movie.results[0].overview,
    //   status: "Not Watched",
    //   user: req.user.id,
    // });
    // res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

//@desc Add movie to mongoDB
//@route POST /movies
router.post(`/addMovie/:id`, ensureAuth, async (req, res) => {
  req.body = req.params.id;
  console.log(req.body);
});

module.exports = router;
