//import data from './data.txt' and loop through it and add to the database
const { MongoClient, ObjectId } = require("mongodb");
// const fetch = require("node-fetch");
const fs = require("fs").promises;
require("dotenv").config({ path: "./config/config.env" });
const DB_STRING = process.env.MONGO_URI;

async function importData() {
  try {
    const data = await fs.readFile("./data.txt", "utf8");
    const client = await MongoClient.connect(DB_STRING);
    const db = client.db(); // Get the database instance from the client
    await db.collection("movies").deleteMany({});
    const movies = data.split("\n");
    for (const movie of movies) {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Wait for 2 seconds before each API call
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${movie}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYWIzNGI5MjE3ODlkYThkZjdkZjM5MmU4MjgzYjNjYiIsInN1YiI6IjY1ZDIzZDllNzdjMDFmMDE2MzBmMTZmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.R-rGV16xv7eqDBejauPToooeVKO2uNNWsmei1VEyA6A",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch data for movie: ${movie}`);
      }
      const movieData = await response.json();
      if (movieData.results.length > 0) {
        await db.collection("movies").insertOne({
          title: movieData.results[0].title,
          release_date: movieData.results[0].release_date,
          poster_path: movieData.results[0].poster_path,
          overview: movieData.results[0].overview,
          id: movieData.results[0].id,
          user: new ObjectId("65ddbe23a8a677e0e11053a7"),
          status: "Not Watched",
        });
        console.log(`Imported data for movie: ${movie}`);
      } else {
        console.log(`No data found for movie: ${movie}`);
      }
    }
    console.log("Import completed successfully.");
    client.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

importData();
