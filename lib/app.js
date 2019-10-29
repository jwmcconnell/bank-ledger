const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/ledger', require('./routes/ledger'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
