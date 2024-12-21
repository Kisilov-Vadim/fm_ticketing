import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {TicketCreatedEvent} from '@vkorg/ticketing-common';

import {Ticket} from '../../../models';
import {natsWrapper} from '../../../nats-wrapper';

import {TicketCreatedListener} from '../ticket-created-listener';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent['data'] = {
    price: 20,
    version: 0,
    title: 'concert',
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // @ts-expect-error no needed other properties
  const msg: Message = {ack: jest.fn()};

  return {listener, data, msg};
}

it('creates and saves a ticket', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});