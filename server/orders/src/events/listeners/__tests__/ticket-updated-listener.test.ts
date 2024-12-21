import mongoose from "mongoose";
import {TicketUpdatedEvent} from "@vkorg/ticketing-common";

import {Ticket} from "../../../models";
import {natsWrapper} from "../../../nats-wrapper";

import {TicketUpdatedListener} from "../ticket-updated-listener";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    price: 10,
    title: 'concert',
    id: new mongoose.Types.ObjectId().toHexString(),
  })

  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    price: 20,
    id: ticket.id,
    title: 'new concert',
    version: ticket.version + 1,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // @ts-expect-error no needed other properties
  const msg: Message = {ack: jest.fn()};

  return {listener, data, ticket, msg};
}

it('funds, updates and saves a ticket', async () => {
  const {listener, ticket, data, msg} = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const {listener, data, msg} = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch {
    // do nothing
  }

  expect(msg.ack).not.toHaveBeenCalled();
});