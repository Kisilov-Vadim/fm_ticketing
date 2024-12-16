import express, {Request, Response} from 'express';
import {
  requireAuth,
  NotFoundError,
  validateRequest,
  BadRequestError,
} from '@vkorg/ticketing-common';

import {Ticket, Order, OrderStatus} from '../../models';

import {validations} from './validations';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const {ticketId} = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) throw new NotFoundError();

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS,
    );

    const order = Order.build({
      ticket,
      expiresAt: expiration,
      status: OrderStatus.Created,
      userId: req.currentUser!.id,
    })

    await order.save();

    res.status(201).send(order);
  })

export {router as newOrderRouter};