require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const { accounts } = require('../data.json');
const ensureAuth = require('../middleware/ensure-auth');

const authToken = (account) => {
  return jwt.sign(account, process.env.APP_SECRET, { expiresIn: '24h' });
};

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    if(!username) {
      const err = new Error('Invalid username');
      err.status = 400;
      return next(err);
    } else if(accounts[username]) {
      const err = new Error('Account already exists');
      err.status = 400;
      return next(err);
    }

    if(!password) {
      const err = new Error('Invalid password');
      err.status = 400;
      return next(err);
    } 

    const passwordHash = bcrypt.hashSync(password);

    const newAccount = { username, passwordHash, balance: 0 };
    const redactedAccount = { username, balance: 0 };

    accounts[username] = newAccount;

    const token = authToken(redactedAccount);
    res.cookie('session', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.send(redactedAccount);
  })

  .post('/login', (req, res, next) => {
    const { username, password } = req.body;

    const account = accounts[username];

    if(!account) {
      const err = new Error('Invalid username/password');
      err.status = 400;
      return next(err);
    }

    const isMatch = bcrypt.compareSync(password, account.passwordHash);

    if(!isMatch) {
      const err = new Error('Invalid username/password');
      err.status = 400;
      return next(err);
    }

    const redactedAccount = { username: account.username, balance: account.balance };

    const token = authToken(redactedAccount);

    res.cookie('session', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.send(redactedAccount);
  })

  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.account);
  });
