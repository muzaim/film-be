const FilmModel = require("../Model/FilmModel");

// get All Film
exports.getAllFilm = (req, res, next) => {
  const currentPage = req.query.currentPage || 1;
  const perPage = req.query.perPage || 8;
  let totalData = 0;

  FilmModel.find()
    .countDocuments()
    .then((count) => {
      totalData = count;
      return FilmModel.find()
        .skip(parseInt(currentPage - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then((result) => {
      res.status(200).json({ OUT_STAT: "T", OUT_DATA: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

// gen Film
exports.genFilm = (req, res, next) => {
  const { title, director, cast, genre, duration, synopsis } = req.body;
  const image = req.file.filename;

  const sendData = new FilmModel({
    title,
    image,
    director,
    cast,
    genre,
    duration,
    synopsis,
  });

  sendData
    .save()
    .then((result) => {
      res
        .status(200)
        .json({ OUT_STAT: "T", OUT_MESS: "Success", OUT_DATA: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

// get Film by Id
exports.getDetailFilm = (req, res, next) => {
  const filmid = req.params.filmid;
  FilmModel.findById(filmid)
    .then((result) => {
      if (!result) {
        const err = new Error(`Film with id : ${filmid} not found!`);
        err.errorStatus = 404;
        throw err;
      }
      res.status(200).json({ OUT_STAT: "T", OUT_DATA: result });
    })
    .catch((err) => {
      next(err);
    });
};

// update Film
exports.updateFilm = (req, res, next) => {
  const { title, image, director, cast, genre, duration, synopsis } = req.body;
  const { filmid } = req.params;

  FilmModel.findById(filmid)
    .then((film) => {
      if (!film) {
        const err = new Error(`Film with id ${filmid} are not found`);
        err.errorStatus = 404;
        throw err;
      }
      film.title = title;
      film.image = image;
      film.director = director;
      film.cast = cast;
      film.genre = genre;
      film.duration = duration;
      film.synopsis = synopsis;

      return film.save();
    })
    .then((result) => {
      res.status(200).json({ OUT_STAT: "T", OUT_DATA: result });
    })
    .catch((err) => {
      next(err);
    });
};

// delete Film
exports.deleteFilm = (req, res, next) => {
  const filmid = req.params.filmid;

  FilmModel.findById(filmid)
    .then((film) => {
      if (!film) {
        const err = new Error(`Filmd with id ${filmid} are not found!`);
        err.errorStatus = 404;
        throw err;
      }
      return FilmModel.findByIdAndRemove(filmid);
    })
    .then((result) => {
      res.status(200).json({ OUT_STAT: "T", OUT_DATA: result });
    })
    .catch((err) => {
      next(err);
    });
};
