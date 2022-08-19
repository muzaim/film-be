const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");

const {
  Register,
  Login,
  GetUserInfo,
} = require("../Controller/UserController");

route.post("/register", Register);
route.post("/login", Login);
route.get("/info", auth, GetUserInfo);

module.exports = route;
