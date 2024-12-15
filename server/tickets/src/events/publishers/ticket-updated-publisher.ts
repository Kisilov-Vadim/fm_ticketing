import {Publisher, Subjects, TicketUpdatedEvent} from '@vkorg/ticketing-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}