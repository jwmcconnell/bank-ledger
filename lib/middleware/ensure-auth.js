const data = require('../data.json');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = (req, res, next) => {
  console.log(req.headers);
  // const token = req.cookies.session;
  const token = cookie.parse(req.headers.cookie).session;
  if(!token) {
    const err = new Error('No session cookie');
    err.status = 401;
    return next(err);
  }
  console.log('token', token);
  console.log('secret', process.env.APP_SECRET);
  const userPayload = jwt.verify(token, process.env.APP_SECRET);
  console.log('userpayload', userPayload);
  const account = data.accounts[userPayload.username];
  console.log('accout', account);
  console.log('data', data);
  if(!account) {
    const err = new Error('Invalid Token');
    err.status = 401;
    return next(err);
  }

  req.account = { username: account.username, balance: account.balance };
  next();
};
