const { sign } = require("jsonwebtoken");

// CREATE TOKEN
// Create Access Token
exports.createAccessToken = (userId, email) => {
  return sign({ userId, email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
    // harusnya ini 15 detik
  });
};

// Create Refresh Token
exports.createRefreshToken = (userId, email) => {
  return sign({ userId, email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "6d",
    // harusnya ini 1 hari
  });
};

// SEND TOKEN
// Send Refresh Token
exports.sendRefreshToken = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

// Send Access Token
exports.sendAccessToken = (req, res, accessToken) => {
  const { email } = req.body;
  res.send({
    accessToken,
    email,
  });
};
