const express = require("express");
const route = express.Router();

const {
  getAllFilm,
  genFilm,
  getDetailFilm,
  deleteFilm,
  updateFilm,
} = require("../Controller/FilmController");

// get all film
route.get("/film", getAllFilm);

// gen film
route.post("/film", genFilm);

// get detail film
route.get("/film/:filmid", getDetailFilm);

// update film
route.put("/film/:filmid", updateFilm);

// delete film
route.delete("/film/:filmid", deleteFilm);

module.exports = route;
