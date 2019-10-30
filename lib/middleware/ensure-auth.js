const data = require('../data.json');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = (req, res, next) => {
  const cookieData = req.headers.cookie;
  if(!cookieData) {
    const err = new Error('No session cookie');
    err.status = 401;
    return next(err);
  }
  const token = cookie.parse(cookieData).session;
  
  if(!token) {
    const err = new Error('No session cookie');
    err.status = 401;
    return next(err);
  }

  const userPayload = jwt.verify(token, process.env.APP_SECRET);
  const account = data.accounts[userPayload.username];

  if(!account) {
    const err = new Error('Invalid Token');
    err.status = 401;
    return next(err);
  }
  req.token = token;
  req.account = { username: account.username, balance: account.balance };
  next();
};
