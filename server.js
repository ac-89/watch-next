const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const PORT = 8000;
require("dotenv").config();

let db;
(dbConnectionStr = process.env.DB_STRING), (dbName = "watch-next-movies");

MongoClient.connect(dbConnectionStr).then((client) => {
  console.log(`Connected to ${dbName} Database`);
  db = client.db(dbName);
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  db.collection("movies")
    .find()
    .toArray()
    .then((data) => {
      //   console.log(data[1].name);
      res.render("index.ejs", { movies: data });
    })
    .catch((err) => console.log(err));
});

app.post("/addMovie", (req, res) => {
  console.log(req);
  db.collection("movies")
    .insertOne({ name: req.body.movie })
    .then((result) => {
      console.log(result);
      res.redirect("/");
    });
});

app.delete("/deleteMovie", (req, res) => {
  console.log(req);
  db.collection("movies")
    .deleteOne({ name: req.body.movieFromJS })
    .then((result) => {
      console.log(result);
      res.json("success");
    });
});

app.listen(PORT || process.env.PORT, () => {
  console.log("Server running...");
});
