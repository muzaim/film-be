const UserModel = require("../Model/UserModel");
const { jwt, verify } = require("jsonwebtoken");
const { genSalt, hash, compare } = require("bcrypt");
const { token } = require("morgan");
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../Middleware/TokenMiddleware");

exports.Register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user) return res.send({ message: `User already exist!` });

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const sendData = new UserModel({
      email,
      password: hashedPassword,
    });

    await sendData.save();

    res.send({ message: "User created!" });
  } catch (error) {
    res.send({ message: error.message });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password!" });

    const accessToken = createAccessToken(user._id, user.email);
    const refreshToken = createRefreshToken(user._id, user.email);

    const filter = { _id: user.id };
    const updateDoc = {
      $set: {
        refreshToken,
      },
    };
    await UserModel.updateOne(filter, updateDoc);

    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken);
  } catch (error) {
    res.send({ error: error.message });
  }
};

exports.Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.send({ accessToken: "No user logged" });

  const user = await UserModel.findOne({ refreshToken }).select([
    "-password",
    "-__v",
  ]);
  if (!user) return res.send({ message: "no user logged" });

  const filter = { _id: user.id };
  const updateDoc = {
    $set: {
      refreshToken: null,
    },
  };
  await UserModel.updateOne(filter, updateDoc);
  res.clearCookie("refreshToken");
  return res.send({ message: "Logged Out" });
};

exports.RefreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.send({ accessToken: "" });

  let payload;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    res.send({ accessToken: "" });
  }

  const user = await UserModel.findById(payload.userId);

  if (!user) return res.send({ accessToken: "" });

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  const filter = { _id: user.id };
  const updateDoc = {
    $set: {
      refreshToken,
    },
  };
  await UserModel.updateOne(filter, updateDoc);

  sendRefreshToken(res, refreshToken);
  return res.send({ accessToken });
};

exports.GetUserInfo = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.send({ accessToken: "No refresh token" });

  const user = await UserModel.findOne({ refreshToken }).select([
    "-password",
    "-__v",
  ]);
  if (!user) return res.send({ message: "No user logged" });
  return res.send({ data: user });
};
