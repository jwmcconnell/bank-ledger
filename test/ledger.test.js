const request = require('supertest');
const app = require('../lib/app');
const { getAgent } = require('./data-helpers');

process.env.NODE_ENV = 'test';

describe('Bank Ledger routes', () => {
  it('Gets the current account balance', () => {
    return getAgent()
      .get('/api/v1/ledger/balance')
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
          balance: 0
        });
      });
  });
});
