import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {MongoMemoryServer} from 'mongodb-memory-server';

declare global {
  // eslint-disable-next-line no-var
  var signin: () => string[];
}

jest.mock('../nats-wrapper.ts');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'adfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();

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

global.signin = () => {
  const payload = {
    email: 'test@test.com',
    id: new mongoose.Types.ObjectId().toHexString(),
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = {jwt: token};
  const sessionsJson = JSON.stringify(session);
  const base64 = Buffer.from(sessionsJson).toString('base64');

  return [`session=${base64}`];
}
