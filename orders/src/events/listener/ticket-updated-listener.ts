import { Listener, subject, TicketUpdatedEvent } from "@akticket/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { queue } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: subject.TicketUpdated = subject.TicketUpdated;
  queue = queue;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("ticket not found");
    }

    const { title, price } = data;
    ticket.set({
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
