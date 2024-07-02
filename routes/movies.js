const express = require("express");
const app = express();
app.use(express.json());
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Movie = require("../models/Movie");
// const {
//   appendHandler,
// } = require("jsdom/lib/jsdom/living/helpers/create-event-accessor");

function refreshPage(window) {
  window.location.reload();
}

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

//@desc Add movie to mongoDB
//@route POST /movies
router.post(`/addMovie/:id`, ensureAuth, async (req, res) => {
  try {
    req.body = req.params.id;
    console.log(req.body);
    const options = {
      headers: {
        method: "POST",
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYWIzNGI5MjE3ODlkYThkZjdkZjM5MmU4MjgzYjNjYiIsIm5iZiI6MTcxOTg2MzMyOC43NTI5NDIsInN1YiI6IjY1ZDIzZDllNzdjMDFmMDE2MzBmMTZmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H_vt6LvP-qndgL7IL5dJHTx3NEUBXwO_BQBE23nVw6Q",
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
    //Reload page
    res.redirect("back");
  } catch (error) {
    console.log(error);
    res.send("error/500");
  }
});

//@desc Update movie watched status
router.put(`/markWatched/:id`, ensureAuth, async (req, res) => {
  try {
    let movieId = req.params.id;
    console.log(`movieId: ${movieId}`);

    // Find the movie document by ID
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Toggle the status between "Not Watched" and "Watched"
    movie.status = movie.status === "Not Watched" ? "Watched" : "Not Watched";

    // Save the updated movie document
    await movie.save();

    // Respond with success message
    res.json({ message: "Status updated successfully", status: movie.status });
    //reloads the page
  } catch (err) {
    console.log(err);
  }
});

//@desc Delete movie

router.delete(`/deleteMovie/:id`, ensureAuth, async (req, res) => {
  try {
    console.log(req)
    let movieId = req.params.id;
    console.log(`movieId: ${movieId}`);
    await Movie.deleteOne({ _id: movieId })
  } catch (error) {
    console.log(error);
    res.status(500).render("error/500", { error: error });
  }
});

module.exports = router;
