const Mongoose = require("mongoose");

const MovieSchema = new Mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  status: {
    type: String,
    default: "Not Watched",
    enum: ["Not Watched", "Watched"],
  },
  user: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  release_date: {
    type: String,
  },
  poster_path: {
    type: String,
  },
  overview: {
    type: String,
  },
  genre_ids: {
    type: Array,
  },
  //star rating
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
});

module.exports = Mongoose.model("Movie", MovieSchema);
