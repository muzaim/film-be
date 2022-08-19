const { compare } = require("bcryptjs");
const UserModel = require("../Model/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { token } = require("morgan");

exports.Register = async (req, res, next) => {
  const body = req.body;

  if (!(body.email && body.password))
    return res.status(400).send({ error: "Data not formatted properly" });

  const user = new UserModel(body);

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);
  user
    .save()
    .then((result) =>
      res.status(201).json({
        OUT_STAT: "T",
        OUT_MESS: "Register Success!",
        OUT_DATA: result,
      })
    )
    .catch((err) => {
      console.log(err);
    });
};

exports.Login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(400).json({ message: "User does not exist" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid Password!" });

  const payload = {
    user: {
      id: user.id,
    },
  };

  try {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7 days" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          OUT_STAT: "T",
          OUT_MESS: "Login Success!",
          OUT_TOKEN: token,
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.GetUserInfo = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id).select([
      "-password",
      "-createdAt",
      "-updatedAt",
    ]);
    res.status(200).json({ OUT_STAT: "T", OUT_DATA: user });
  } catch (error) {
    res.status(500).json(error);
  }
};
