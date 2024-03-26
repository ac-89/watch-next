//import data from './data.txt' and loop through it and add to the database

const fs = require("fs");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const DB_STRING = process.env.DB_STRING;

async function importData() {
  const data = fs.readFileSync("./data.txt", "utf8");
  const client = await MongoClient.connect(DB_STRING);
  const db = client.db(); // Get the database instance from the client
  const movies = data.split("\n");
  for (const movie of movies) {
    await db.collection("movies").insertOne({ name: movie, watched: false });
  }
}

importData();
