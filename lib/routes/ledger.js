const { Router } = require('express');
const { accounts } = require('../data.json');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .get('/balance', ensureAuth, (req, res) => {
    res.send({ balance: accounts[req.account.username].balance });
  });
