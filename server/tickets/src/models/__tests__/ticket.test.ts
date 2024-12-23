import mongoose from 'mongoose';

import {Ticket} from '../ticket'

it('implement optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    price: 5,
    title: 'concert',
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({price: 10})
  secondInstance!.set({price: 15})

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    price: 5,
    title: 'concert',
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});