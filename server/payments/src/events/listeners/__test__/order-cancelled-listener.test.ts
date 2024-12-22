import mongoose from "mongoose";
import {OrderCancelledEvent, OrderStatus} from "@vkorg/ticketing-common";

import {Order} from "../../../models";
import {natsWrapper} from "../../../nats-wrapper";

import {OrderCancelledListener} from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    price: 10,
    version: 0,
    userId: 'user',
    status: OrderStatus.Created,
    id: new mongoose.Types.ObjectId().toHexString(),
  })

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    version: 1,
    id: order.id,
    ticket: {id: 'ticket'},
  };

  // @ts-expect-error - only need the ack function
  const msg: Message = {ack: jest.fn()};

  return {listener, data, order, msg};
}

it('updates the status of the order', async () => {
  const {listener, data, order, msg} = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});