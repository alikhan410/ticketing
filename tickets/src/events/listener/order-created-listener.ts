import { Listener, OrderCreateEvent, subject } from "@akticket/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from "../../nats-wrapper";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";
import { queue } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreateEvent> {
  subject: OrderCreateEvent["subject"] = subject.OrderCreated;
  queue = queue;

  async onMessage(data: OrderCreateEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: data.id });

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      title: ticket.title,
      price: ticket.price,
      id: ticket.id,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
