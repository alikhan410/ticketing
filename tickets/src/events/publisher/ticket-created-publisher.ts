import { Publisher, subject, TicketCreatedEvent } from "@akticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: TicketCreatedEvent["subject"] = subject.TicketCreated;
}
