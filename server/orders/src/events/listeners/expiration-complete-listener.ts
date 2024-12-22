import {Message} from "node-nats-streaming";
import {
  Subjects,
  Listener,
  OrderStatus,
  ExpirationCompletedEvent,
} from "@vkorg/ticketing-common";

import {Order} from "../../models";

import {OrderCancelledPublisher} from "../publishers";

import {queueGroupName} from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompletedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) throw new Error('Order not found');
    if (order.status === OrderStatus.Complete) return msg.ack();

    order.set({status: OrderStatus.Cancelled})
    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {id: order.ticket.id},
    });

    msg.ack();
  }
}