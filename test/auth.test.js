const request = require('supertest');
const app = require('../lib/app');
const { getAgent } = require('./data-helpers');
// const agent = request.agent('http://localhost:7890`');

process.env.NODE_ENV = 'test';

describe('Bank Ledger auth routes', () => {
  it('creates a new account on signup', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'test-name', password: 'test-password' })
      .then(res => {
        expect(res.body).toEqual({
          username: 'test-name',
          balance: 0
        });
      });
  });

  it('verifies that a user if logged in', () => {
    return getAgent()
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ username: 'agent', balance: 0 });
      });
  });

  it('fails to create an account without a username', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: '', password: 'test-password' })
      .then(res => {
        expect(res.status).toEqual(400);
      });
  });

  it('fails to create an account without a password', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'password-test-name', password: '' })
      .then(res => {
        expect(res.status).toEqual(400);
      });
  });

  it('fails to create an account with a previously used username', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'test-name', password: 'other-password' })
      .then(res => {
        expect(res.status).toEqual(400);
      });
  });

  it('validates a successful login attemp', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'test-name', password: 'test-password' })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
          username: 'test-name',
          balance: 0
        });
      });
  });

  it('rejects a login attempt for a nonexistant account', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'some-account', password: 'test-password' })
      .then(res => {
        expect(res.status).toEqual(400);
      });
  });

  it('rejects a login attempt with an incorrect password', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'test-name', password: 'wrong-password' })
      .then(res => {
        expect(res.status).toEqual(400);
      });
  });
});
