const jwt = require('jsonwebtoken');

exports.createSecretToken = (payload) =>
  jwt.sign({ id: payload }, process.env.TOKEN_SECRET_KEY, {
    expiresIn: process.env.TOKEN_SECRET_EXPIRESIN,
  });

exports.createAccessToken = (payload) =>
  jwt.sign({ id: payload }, process.env.TOKEN_ACCESS_KEY, {
    expiresIn: process.env.TOKEN_ACCESS_EXPIRESIN,
  });

exports.sendCookietoBrowser = (res, token) => {
  let cookieOptions = {
    maxAge: 90 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
};

exports.removeCookieFromBrowser = (res) => {
  let cookieOptions = {
    maxAge: 0,
    httpOnly: true,
  };

  res.clearCookie('jwt', cookieOptions);
};
