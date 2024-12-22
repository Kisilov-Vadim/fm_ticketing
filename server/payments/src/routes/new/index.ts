import express, {Request, Response} from 'express';
import {
  OrderStatus,
  requireAuth,
  NotFoundError,
  validateRequest,
  BadRequestError,
  NotAuthorizeError,
} from '@vkorg/ticketing-common';

import {stripe} from '../../stripe';
import {Order, Payment} from '../../models';
import {natsWrapper} from '../../nats-wrapper';
import {PaymentCreatedPublisher} from '../../events/publishers';

import {validations} from './validations';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const {token, orderId} = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizeError();
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }

    const charge = await stripe.charges.create({
      source: token,
      currency: 'usd',
      amount: order.price * 100,
    });

    const payment = Payment.build({orderId: order.id, stripeId: charge.id});
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({id: payment.id});
  });

export {router as createChargeRouter};