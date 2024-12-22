import {Message} from "node-nats-streaming";
import {
  Listener,
  Subjects,
  OrderStatus,
  OrderCancelledEvent,
} from "@vkorg/ticketing-common";

import {Order} from "../../models";

import {queueGroupName} from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) throw new Error('Order not found');

    order.set({status: OrderStatus.Cancelled});
    await order.save();

    msg.ack();
  }
}