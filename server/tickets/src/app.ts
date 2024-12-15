import 'express-async-errors';
import express from 'express';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';

import {
  currentUser,
  errorHandler,
  NotFoundError,
} from '@vkorg/ticketing-common';

import {
  allTicketsRouter,
  showTicketRouter,
  createTicketRouter,
  updateTicketRouter,
} from './routes';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}));

app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(allTicketsRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
  throw new NotFoundError()
});

app.use(errorHandler);

export {app};