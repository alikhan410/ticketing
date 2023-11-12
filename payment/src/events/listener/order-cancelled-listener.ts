import { Listener, OrderCancelledEvent, orderStatus, subject } from "@akticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: subject.OrderCancelled = subject.OrderCancelled;
  queue = "payment-service";
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("order not found");
    }

    order.set({ status: orderStatus.Cancelled });
    await order.save();
    msg.ack();
  }
}
