import {Message} from "node-nats-streaming";
import {OrderCreatedEvent, OrderStatus} from "@vkorg/ticketing-common";

import {natsWrapper} from "../../../nats-wrapper";

import {OrderCreatedListener} from "../order-created-listener";
import mongoose from "mongoose";
import {Order} from "../../../models";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    version: 0,
    userId: 'user',
    expiresAt: 'expiresAt',
    status: OrderStatus.Created,
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      price: 10,
      id: 'ticket',
    }
  };

  // @ts-expect-error - only need the ack function
  const msg: Message = {ack: jest.fn()};

  return {listener, data, msg};
}

it('replicates the order info', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});