import 'express-async-errors';
import express from 'express';
import {json} from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import {NotFoundError} from './errors';
import {errorHandler} from './middlewares';
import {
  signInRouter,
  signUpRouter,
  signOutRouter,
  currentUserRouter,
} from './routes';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({signed: false, secure: true}));

app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);
app.use(currentUserRouter);

app.all('*', async () => {
  throw new NotFoundError()
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
}

start();