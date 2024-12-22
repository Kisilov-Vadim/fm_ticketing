import {PaymentCreatedEvent, Publisher, Subjects} from "@vkorg/ticketing-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}