import { Publisher, subject, OrderCancelledEvent } from "@akticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: OrderCancelledEvent["subject"] = subject.OrderCancelled;
}
