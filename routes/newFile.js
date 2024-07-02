const { ensureAuth } = require("../middleware/auth");
const Movie = require("../models/Movie");
const { router } = require(".");

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
    const movies = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movieTitle}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        return data.results;
      });
    if (movies[0].id == dbMovies[0].id) {
      movies.shift(0);
    }

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
