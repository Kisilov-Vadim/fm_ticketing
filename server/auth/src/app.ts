import 'express-async-errors';
import express from 'express';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';

import {NotFoundError, errorHandler} from '@vkorg/ticketing-common';
import {
  signInRouter,
  signUpRouter,
  signOutRouter,
  currentUserRouter,
} from './routes';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}));

app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);
app.use(currentUserRouter);

app.all('*', async () => {
  throw new NotFoundError()
});

app.use(errorHandler);

export {app};