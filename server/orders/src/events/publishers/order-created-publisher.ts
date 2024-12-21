import {Publisher, OrderCreatedEvent, Subjects} from '@vkorg/ticketing-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}