const { Router } = require('express');
const { accounts } = require('../data.json');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .get('/balance', ensureAuth, (req, res) => {
    res.send({ balance: accounts[req.account.username].balance });
  })

  .post('/deposit', ensureAuth, (req, res, next) => {

    const { amount } = req.body;

    if(amount < 0.01) {
      const err = new Error('Cannot make deposit for less than $0.01.');
      err.status = 400;
      return next(err);
    }
    if(typeof amount !== 'number') {
      const err = new Error('Please supply a number, under amount, for deposit.');
      err.status = 400;
      return next(err);
    }

    const formatedAmount = parseFloat((Math.floor(amount * 100) / 100).toFixed(2));

    const { username } = req.account;
    let account = accounts[username];
    account.balance += formatedAmount;

    accounts[username] = account;
    res.send({ balance: account.balance });
  });
