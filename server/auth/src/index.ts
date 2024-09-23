import 'express-async-errors';
import express from 'express';
import {json} from 'body-parser';

import {NotFoundError} from './errors';
import {errorHandler} from './middlewares';
import {
  signInRouter,
  signUpRouter,
  signOutRouter,
  currentUserRouter,
} from './routes';

const app = express();

app.use(json());

app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);
app.use(currentUserRouter);

app.all('*', async () => {
  throw new NotFoundError()
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
