import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {MongoMemoryServer} from 'mongodb-memory-server';

declare global {
  // eslint-disable-next-line no-var
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper.ts');

process.env.STRIPE_KEY = 'sk_test_51Ln1fXBCiF8BnuA5xkGgc5MwoURodQItnSGIKomgrdV8OdFLpqkK2LkDwxeVaoScDNEQd2HshXeV37rXtOVdI53600oqJaJapX';

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

global.signin = (id = new mongoose.Types.ObjectId().toHexString()) => {
  const payload = {
    id,
    email: 'test@test.com',
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = {jwt: token};
  const sessionsJson = JSON.stringify(session);
  const base64 = Buffer.from(sessionsJson).toString('base64');

  return [`session=${base64}`];
}
