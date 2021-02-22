import mongoose from 'mongoose';
import { connectToDataBase } from '../mongoConnection';
import { User } from './user';

describe('User model', () => {
  beforeAll(() => {
    connectToDataBase();
  });
  afterAll((done) => {
    mongoose.disconnect(done);
  });

  test('User without authorName', () => {
    const user = new User({ userName: 'testUser', role: 'MAIN', mainAccount: 'testMain', password: 'banana' });

    
      expect(user.save).toThrowError();
  });
});
