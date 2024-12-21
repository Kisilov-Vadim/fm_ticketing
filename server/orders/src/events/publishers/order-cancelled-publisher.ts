import {Publisher, Subjects, OrderCanceledEvent} from '@vkorg/ticketing-common';

export class OrderCancelledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCancelled;
}