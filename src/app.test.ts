import request from 'supertest';
import mongoose from 'mongoose';
import app, { server } from './app';
import { connectToDataBase } from './mongoConnection';

describe('Test the user route', () => {

  beforeAll(() => {
    connectToDataBase();
  });
  afterAll((done) => {
    server.close(done);
    mongoose.disconnect(done);
  });
  test('It should response the GET method', (done) => {
    request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ userName: 'test', password: '123456' })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
