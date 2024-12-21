import mongoose from "mongoose";
import {OrderCanceledEvent} from "@vkorg/ticketing-common";

import {Ticket} from "../../../models";
import {natsWrapper} from "../../../nats-wrapper";

import {OrderCancelledListener} from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    price: 99,
    userId: 'asdf',
    title: 'concert',
  })

  ticket.set({orderId});
  await ticket.save();

  const data: OrderCanceledEvent['data'] = {
    version: 0,
    id: orderId,
    ticket: {id: ticket.id},
  }

  // @ts-expect-error - no need other props
  const msg: Message = {ack: jest.fn()};

  return {listener, ticket, data, orderId, msg};
}

it('updates the ticket, publishes an event, and acks the message', async () => {
  const {listener, ticket, data, msg} = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(msg.ack).toHaveBeenCalled();
  expect(updatedTicket!.orderId).toBeUndefined();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});