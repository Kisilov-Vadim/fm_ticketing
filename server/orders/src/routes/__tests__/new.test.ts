import request from 'supertest';
import mongoose from "mongoose";

import {app} from "../../app";
import {natsWrapper} from '../../nats-wrapper';
import {Order, Ticket, OrderStatus} from '../../models';

const buildTicket = async () => {
  const ticket = Ticket.build({
    price: 20,
    title: 'concert',
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  return ticket;
}

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId})
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = await buildTicket();

  const order = Order.build({
    ticket,
    userId: 'asdf',
    expiresAt: new Date(),
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = await buildTicket();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201);
});

it('emits an order created event', async () => {
  const ticket = await buildTicket();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});