import { Publisher, subject, OrderExpirationEvent } from "@akticket/common";

export class OrderExpirationPublisher extends Publisher<OrderExpirationEvent> {
  subject: OrderExpirationEvent["subject"] = subject.OrderExpiration;
}
