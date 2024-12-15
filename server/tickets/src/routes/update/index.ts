import express, {Request, Response} from 'express';
import {
  requireAuth,
  NotFoundError,
  validateRequest,
  NotAuthorizeError,
} from '@vkorg/ticketing-common';

import {Ticket} from '../../models';
import {natsWrapper} from '../../nats-wrapper';
import {TicketUpdatedPublisher} from '../../events';

import {validations} from './validations';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError();

    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizeError()

    ticket.set({title: req.body.title, price: req.body.price,});

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    })

    res.send(ticket);
  }
);

export {router as updateTicketRouter};