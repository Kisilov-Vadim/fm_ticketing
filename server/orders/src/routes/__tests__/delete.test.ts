import request from 'supertest';

import {app} from '../../app';
import {Order, OrderStatus, Ticket} from '../../models';

it("marks an order as canceled", async () => {
  const ticket = await Ticket.build({title: 'concert', price: 20});
  await ticket.save();

  const user = global.signin();

  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo("emits an order canceled event");