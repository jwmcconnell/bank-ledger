const bcrypt = require('bcryptjs');
const { Router } = require('express');
const { accounts } = require('../data.json');

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

    const newAccount = {
      username,
      passwordHash,
      balance: 0
    };

    accounts[username] = newAccount;

    res.send({ username: newAccount.username, balance: newAccount.balance });
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

    res.send({ username: account.username, balance: account.balance });
  });
