const express = require("express");
const app = express();
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const bodyParser = require("body-parser");

const Movie = require("../models/Movie");
const {
  appendHandler,
} = require("jsdom/lib/jsdom/living/helpers/create-event-accessor");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//@desc Show add page
//@route GET /movies/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("movies/add");
});

// router.get("/search", async (req, res) => {
//   try {
//     console.log(req.query.title);
//     let result = await Movie.aggregate([
//       {
//         "$search": {
//           "autocomplete": {
//             "query": `${req.query}`,
//             "path": "title",
//             "fuzzy": {
//               "maxEdits": 2,
//               "prefixLength": 3,
//             },
//           },
//         },
//       },
//     ]).toArray();
//     console.log(result);
//     res.render("search", { movies: result });
//   } catch (error) {
//     console.log(error);
//     res.send("error/500");
//   }
// });

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
router.get("/search", ensureAuth, async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.id;
    const options = {
      headers: {
        method: "GET",
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYWIzNGI5MjE3ODlkYThkZjdkZjM5MmU4MjgzYjNjYiIsInN1YiI6IjY1ZDIzZDllNzdjMDFmMDE2MzBmMTZmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.R-rGV16xv7eqDBejauPToooeVKO2uNNWsmei1VEyA6A",
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
    console.log(`dbMovies: ${dbMovies}`);
    const movies = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movieTitle}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        return data.results;
      });
    console.log(`movies: ${movies}`);
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

//@desc Add movie to mongoDB
//@route POST /movies
router.post(`/addMovie/:id`, ensureAuth, async (req, res) => {
  try {
    req.body = req.params.id;
    console.log(req.body);
    const options = {
      headers: {
        method: "GET",
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYWIzNGI5MjE3ODlkYThkZjdkZjM5MmU4MjgzYjNjYiIsInN1YiI6IjY1ZDIzZDllNzdjMDFmMDE2MzBmMTZmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.R-rGV16xv7eqDBejauPToooeVKO2uNNWsmei1VEyA6A",
      },
    };
    const movie = await fetch(
      `https://api.themoviedb.org/3/movie/${req.body}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(req.user.id);
        return data;
      });
    await Movie.create({
      title: movie.title,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      overview: movie.overview,
      status: "Not Watched",
      user: req.user.id,
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.send("error/500");
  }
});

//@desc Update movie watched status
router.put(`/updateMovie/:id`, ensureAuth, async (req, res) => {
  try {
    const options = {
      headers: {
        method: "POST",
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYWIzNGI5MjE3ODlkYThkZjdkZjM5MmU4MjgzYjNjYiIsInN1YiI6IjY1ZDIzZDllNzdjMDFmMDE2MzBmMTZmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.R-rGV16xv7eqDBejauPToooeVKO2uNNWsmei1VEyA6A",
      },
    };
    req.body = req.params.id;
    console.log(req.body);
    await Movie.findOneAndUpdate({ _id: req.body }, { status: "Watched" });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.send("error/500");
  }
});

module.exports = router;
