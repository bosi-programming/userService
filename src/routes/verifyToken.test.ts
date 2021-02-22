import request from 'supertest';
import mongoose from 'mongoose';
import app, { server } from '../app';
import { connectToDataBase } from '../mongoConnection';

describe('Test the user route', () => {
  beforeAll(() => {
    connectToDataBase();
  });
  afterAll((done) => {
    server.close(done);
    mongoose.disconnect(done);
  });

  let token = '';
  test('It should receive a 200 for verify token for a valid user', async (done) => {
    await request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ userName: 'test', password: '123456' })
      .then((res) => {
        token = res.body.token;
      })
      .catch((err) => {
        done(err);
      });
    await request(app)
      .post('/api/verify-token')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send()
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 500 for verify token for an invalid token', async (done) => {
    await request(app)
      .post('/api/verify-token')
      .set('Accept', 'application/json')
      .set('x-access-token', 'banana')
      .send()
      .then((res) => {
        expect(res.status).toBe(500);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 401 for a post without token', async (done) => {
    await request(app)
      .post('/api/verify-token')
      .set('Accept', 'application/json')
      .send()
      .then((res) => {
        expect(res.status).toBe(401);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
