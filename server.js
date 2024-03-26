const express = require("express");
const app = express();
// const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const passport = require("passport");
const connectDB = require("./config/db");
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const dotenv = require("dotenv");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const exphbs = require("express-handlebars");

dotenv.config({ path: "./config/config.env" });

require("./config/passport")(passport);

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const addIcon = require("./helpers/hbs");

//handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    helpers: {
      addIcon,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);

//express session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/movies", require("./routes/movies"));

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.get("/", (req, res) => {
//   db.collection("movies")
//     .find()
//     .toArray()
//     .then((data) => {
//       const rand = Math.floor(Math.random() * data.length);
//       console.log(rand);

//       res.render("index.ejs", { movies: data, rand: rand });
//     })
//     .catch((err) => console.log(err));
// });

// app.post("/addMovie", (req, res) => {
//   console.log(req);
//   db.collection("movies")
//     .insertOne({ name: req.body.movie, watched: false })
//     .then((result) => {
//       console.log(result);
//       res.redirect("/");
//     });
// });

// app.delete("/deleteMovie", (req, res) => {
//   console.log(req);
//   db.collection("movies")
//     .deleteOne({ name: req.body.movieFromJS })
//     .then((result) => {
//       console.log(result);
//       res.json("success");
//     });
// });

// app.put("/markWatched", (request, response) => {
//   const watched = request.body.itemFromJS.watched;
//   console.log(watched);
//   db.collection("movies")
//     .updateOne(
//       { name: request.body.itemFromJS },
//       {
//         $set: {
//           watched: !watched,
//         },
//       },
//       {
//         upsert: false,
//       }
//     )
//     .then((result) => {
//       "";
//       console.log("Marked Watched");
//       console.log(request.body);
//       response.json("Marked Watched");
//     })
//     .catch((error) => console.error(error));
// });

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${PORT}...`
  );
});
