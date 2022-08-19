const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FilmModel = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    cast: {
      type: [String],
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    synopsis: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Film", FilmModel);
