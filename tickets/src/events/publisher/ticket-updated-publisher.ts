import { Publisher, subject, TicketUpdatedEvent } from "@akticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: TicketUpdatedEvent["subject"] = subject.TicketUpdated;
}
