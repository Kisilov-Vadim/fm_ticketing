import express, {Request, Response} from 'express';
import {requireAuth, validateRequest} from '@vkorg/ticketing-common';

import {Ticket} from '../../models';

import {validations} from './validations';
import {TicketCreatedPublisher} from '../../events';
import {natsWrapper} from '../../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const {title, price} = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    })

    res.status(201).send(ticket);
  });

export {router as createTicketRouter};