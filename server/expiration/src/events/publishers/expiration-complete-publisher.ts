import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@vkorg/ticketing-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}