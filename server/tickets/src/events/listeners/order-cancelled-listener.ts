import {Message} from "node-nats-streaming";
import {Listener, OrderCanceledEvent, Subjects} from "@vkorg/ticketing-common";

import {Ticket} from "../../models";

import {TicketUpdatedPublisher} from "../publishers";

import {queueGroupName} from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCanceledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new Error('Ticket not found');

    ticket.set({orderId: undefined});
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}