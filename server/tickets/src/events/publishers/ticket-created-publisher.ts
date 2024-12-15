import {Publisher, Subjects, TicketCreatedEvent} from '@vkorg/ticketing-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}