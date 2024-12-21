import express, {Request, Response} from 'express';
import {
  OrderStatus,
  requireAuth,
  NotFoundError,
  NotAuthorizeError,
} from '@vkorg/ticketing-common';

import {Order} from '../../models';
import {natsWrapper} from '../../nats-wrapper';
import {OrderCancelledPublisher} from '../../events';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const {orderId} = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizeError();

    order.status = OrderStatus.Cancelled;

    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {id: order.ticket.id},
    });

    res.status(204).send(order);
  })

export {router as deleteOrderRouter};