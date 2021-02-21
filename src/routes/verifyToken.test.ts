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

  test('It should receive a 200 for verify token for a valid user', async (done) => {
    let token = '';
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
        console.log(res.body);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
})

