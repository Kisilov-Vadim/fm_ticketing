import {Message} from "node-nats-streaming";
import {Listener, OrderCreatedEvent, Subjects} from "@vkorg/ticketing-common";

import {expirationQueue} from "../../queues";

import {queueGroupName} from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add({orderId: data.id}, {delay});

    msg.ack();
  }
}