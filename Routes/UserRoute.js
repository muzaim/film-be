const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");

const {
  Register,
  Login,
  GetUserInfo,
  Logout,
  RefreshToken,
} = require("../Controller/UserController");

route.post("/register", Register);
route.post("/login", Login);
route.post("/logout", Logout);
route.post("/refresh-token", RefreshToken);
route.get("/info", GetUserInfo);

module.exports = route;
