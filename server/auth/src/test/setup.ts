import mongoose from 'mongoose';
import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';

import {app} from '../app';

declare global {
  // eslint-disable-next-line no-var
  var signin: () => Promise<string[]>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'adfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({email, password})
    .expect(201);

  const cookie = response.get("Set-Cookie");

  if (!cookie) {
    throw new Error("Failed to get cookie from response");
  }
  return cookie;
}
