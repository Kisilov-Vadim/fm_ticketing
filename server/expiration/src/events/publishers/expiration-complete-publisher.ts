import {
  Subjects,
  Publisher,
  ExpirationCompletedEvent,
} from "@vkorg/ticketing-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationComplete;
}