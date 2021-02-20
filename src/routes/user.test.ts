import request from 'supertest';
import mongoose from 'mongoose';
import app, { server } from '../app';
import { connectToDataBase } from '../mongoConnection';

describe('Test the login route', () => {
  beforeAll(() => {
    connectToDataBase();
  });
  afterAll((done) => {
    server.close(done);
    mongoose.disconnect(done);
  });

  test('It should receive a 200 for a valid fake new user', async (done) => {
    await request(app)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send({ userName: 'fakeNewUser', authorName: 'fakeNewAuthor', role: 'MAIN', mainAccount: 'fakeNewUser', password: '123456' })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('It should receive a 200 for delete a valid user', async (done) => {
    await request(app)
      .delete('/api/users')
      .set('Accept', 'application/json')
      .send({ userName: 'fakeNewUser', authorName: 'fakeNewAuthor', role: 'MAIN', mainAccount: 'fakeNewUser', password: '123456' })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
})
