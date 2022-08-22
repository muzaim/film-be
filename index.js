const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const BlogRoute = require("./Routes/FilmRoute");
const UserRoute = require("./Routes/UserRoute");
const BodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { fileStorage, fileFilter } = require("./Utilities/ImageUp.js");
const cookieParser = require("cookie-parser");

// use express
const app = express();

//use cookie parser
app.use(cookieParser());

// use morgan
app.use(morgan("tiny"));

// use cors
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

// use body-parser
app.use(BodyParser.json());

// use multer
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

// use routing
app.use("/api/v1/", BlogRoute);
app.use("/api/v1/user/", UserRoute);

app.use((err, req, res, next) => {
  const status = err.errorStatus || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message, data });
});

mongoose
  .connect(
    "mongodb+srv://muzaim:4JpvPM9vCLp93Fg2@cluster0.e24c9kc.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(5000, () => {
      console.log(`Server is running on : http://localhost:5000/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
