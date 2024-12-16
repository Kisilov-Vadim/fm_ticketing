import express, {Request, Response} from 'express';
import {
  OrderStatus,
  requireAuth,
  NotFoundError,
  NotAuthorizeError,
} from '@vkorg/ticketing-common';

import {Order} from '../../models';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const {orderId} = req.params;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizeError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);
  })

export {router as deleteOrderRouter};