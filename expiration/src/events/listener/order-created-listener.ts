import { Listener, OrderCreateEvent, subject } from "@akticket/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "./expiration-queue";
import { queue } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreateEvent> {
  subject: OrderCreateEvent["subject"] = subject.OrderCreated;
  queue = queue;

  async onMessage(data: OrderCreateEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add({ orderId: data.id }, { delay });
    msg.ack();
  }
}
