import { Listener, OrderCreateEvent, subject } from "@akticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class OrderCreatedListener extends Listener<OrderCreateEvent> {
  subject: subject.OrderCreated = subject.OrderCreated;
  queue = "payment-service";
  async onMessage(data: OrderCreateEvent["data"], msg: Message) {
    const { id, userId, status, version } = data;
    const order = Order.build({ id, userId, status, version, price: data.ticket.price });
    await order.save();

    msg.ack();
  }
}
