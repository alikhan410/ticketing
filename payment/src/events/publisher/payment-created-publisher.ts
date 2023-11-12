import { Publisher, PaymentCreatedEvent, subject } from "@akticket/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: subject.PaymentCreated = subject.PaymentCreated;
}
