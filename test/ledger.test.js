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

  it('Makes a deposit', () => {
    return getAgent()
      .post('/api/v1/ledger/deposit')
      .send({ amount: 20.0099999 })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ balance: 20.00 });
      });
  });

  it('Makes a deposit with change involved', () => {
    return getAgent()
      .post('/api/v1/ledger/deposit')
      .send({ amount: 14.3799 })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ balance: 34.37 });
      });
  });

  it('Ignores anything under a cent on a deposit', () => {
    return getAgent()
      .post('/api/v1/ledger/deposit')
      .send({ amount: 10.0099235 })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ balance: 44.37 });
      });
  });

  it('Throws an error when a negative number is used for a deposit', () => {
    return getAgent()
      .post('/api/v1/ledger/deposit')
      .send({ amount: -10.259 })
      .then(res => {
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({ 
          status: 400,
          message: 'Cannot make deposit for less than $0.01.'
        });
      });
  });

  it('Throws an error when anything but a number used for a deposit', () => {
    return getAgent()
      .post('/api/v1/ledger/deposit')
      .send({ amount: '10.25' })
      .then(res => {
        expect(res.body).toEqual({ 
          status: 400,
          message: 'Please supply a number, under amount, for a deposit.'
        });
      });
  });

  it('Makes a withdrawal', () => {
    return getAgent()
      .post('/api/v1/ledger/withdrawal')
      .send({ amount: 10.009999 })
      .then(res => {
        expect(res.body).toEqual({ balance: 34.37 });
      });
  });

  it('Makes a withdrawal with change involved', () => {
    return getAgent()
      .post('/api/v1/ledger/withdrawal')
      .send({ amount: 10.109999 })
      .then(res => {
        expect(res.body).toEqual({ balance: 24.27 });
      });
  });

  it('Throws an error when a negative number is used for a deposit', () => {
    return getAgent()
      .post('/api/v1/ledger/withdrawal')
      .send({ amount: -10.10 })
      .then(res => {
        expect(res.body).toEqual({ 
          status: 400,
          message: 'Cannot make withdrawal for less than $0.01.'
        });
      });
  });

  it('Throws an error when a non number is used for a deposit', () => {
    return getAgent()
      .post('/api/v1/ledger/withdrawal')
      .send({ amount: '10.10' })
      .then(res => {
        expect(res.body).toEqual({ 
          status: 400,
          message: 'Please supply a number, under amount, for a withdrawal.'
        });
      });
  });

  it('Throws an error when the withdawal amount is greater than balance', () => {
    return getAgent()
      .post('/api/v1/ledger/withdrawal')
      .send({ amount: 50.00 })
      .then(res => {
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({ 
          status: 400,
          message: 'You may not withdraw more than you have in you account.'
        });
      });
  });

  it('Gets a list of all transactions the user has made', () => {
    return getAgent() 
      .get('/api/v1/ledger/transactions')
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body[0]).toEqual({
          startingBalance: 34.37,
          amount: 10.1,
          type: 'Withdrawal',
          endingBalance: 24.27
        });
        expect(res.body[4]).toEqual({
          startingBalance: 0,
          amount: 20,
          type: 'Deposit',
          endingBalance: 20
        });
      });
  });
});
