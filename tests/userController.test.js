const request = require('supertest');
const app = require('../index');

describe('User Registration and Login', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('User registered successfully');
  });

  it('should log in an existing user', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'password'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Login successful');
  });
});
