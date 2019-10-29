const { Router } = require('express');
const { accounts, transactions } = require('../data.json');
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
      const err = new Error('Please supply a number, under amount, for a deposit.');
      err.status = 400;
      return next(err);
    }

    const formatedAmount = parseFloat((Math.trunc(amount * 100) / 100).toFixed(2));

    const { username } = req.account;

    let account = accounts[username];
    let transaction = { 
      startingBalance: account.balance,
      amount: formatedAmount,
      type: 'Deposit'
    };
    
    account.balance = parseFloat((account.balance + formatedAmount).toFixed(2));
    transaction.endingBalance = account.balance;
    transactions[username] = [transaction, ...transactions[username] || []];
    accounts[username] = account;
    res.send({ balance: account.balance });
  })

  .post('/withdrawal', ensureAuth, (req, res, next) => {
    const { amount } = req.body;

    if(amount < 0.01) {
      const err = new Error('Cannot make withdrawal for less than $0.01.');
      err.status = 400;
      return next(err);
    }
    if(typeof amount !== 'number') {
      const err = new Error('Please supply a number, under amount, for a withdrawal.');
      err.status = 400;
      return next(err);
    }

    const formatedAmount = parseFloat((Math.trunc(amount * 100) / 100).toFixed(2));

    const { username } = req.account;
    let account = accounts[username];
    if(account.balance < amount) {
      const err = new Error('You may not withdraw more than you have in your account.');
      err.status = 400;
      return next(err);
    }

    let transaction = { 
      startingBalance: account.balance,
      amount: formatedAmount,
      type: 'Withdrawal'
    };
    account.balance = parseFloat((account.balance - formatedAmount).toFixed(2));
    transaction.endingBalance = account.balance;
    transactions[username] = [transaction, ...transactions[username] || []];
    accounts[username] = account;
    
    res.send({ balance: account.balance });
  })

  .get('/transactions', ensureAuth, (req, res) => {
    res.send(transactions[req.account.username]);
  });
