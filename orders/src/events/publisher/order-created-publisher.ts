import { Publisher, subject, OrderCreateEvent } from "@akticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreateEvent> {
  subject: OrderCreateEvent["subject"] = subject.OrderCreated;
}
