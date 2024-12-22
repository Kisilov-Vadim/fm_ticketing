import {Publisher, Subjects, OrderCancelledEvent} from '@vkorg/ticketing-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}