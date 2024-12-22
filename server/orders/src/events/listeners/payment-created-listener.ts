import {Message} from "node-nats-streaming";
import {
  Listener,
  Subjects,
  OrderStatus,
  NotFoundError,
  PaymentCreatedEvent,
} from "@vkorg/ticketing-common";

import {Order} from "../../models";

import {queueGroupName} from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) throw new NotFoundError();

    order.set({status: OrderStatus.Complete});
    await order.save();

    msg.ack();
  }
}