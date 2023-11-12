import { Listener, OrderExpirationEvent, orderStatus, subject } from "@akticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";
import { queue } from "./queue-group-name";

export class OrderExpirationListener extends Listener<OrderExpirationEvent> {
  subject: OrderExpirationEvent["subject"] = subject.OrderExpiration;
  queue = queue;

  async onMessage(data: OrderExpirationEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === orderStatus.Completed) {
      return msg.ack();
    }

    order.status = orderStatus.Cancelled;

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      ticket: { id: order.ticket.id },
      version: order.version,
    });

    msg.ack();
  }
}
