import {Message} from "node-nats-streaming";
import {Listener, Subjects, TicketCreatedEvent} from "@vkorg/ticketing-common";

import {Ticket} from "../../models";

import {queueGroupName} from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const {title, price, id} = data;
    const ticket = Ticket.build({id, title, price});
    await ticket.save();

    msg.ack();
  }
}