const request = require('supertest');
const app = require('../lib/app');

let agent = request.agent(app);

beforeEach(async() => {
  return await agent
    .post('/api/v1/auth/signup')
    .send({ username: 'agent', password: 'password' });
});

module.exports = {
  getAgent: () => agent
};
