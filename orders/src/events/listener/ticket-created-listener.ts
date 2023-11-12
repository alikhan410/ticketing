import { Listener, subject, TicketCreatedEvent } from "@akticket/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { queue } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: subject.TicketCreated = subject.TicketCreated;
  queue = queue;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({ id, title, price });

    await ticket.save();

    msg.ack();
  }
}
queue