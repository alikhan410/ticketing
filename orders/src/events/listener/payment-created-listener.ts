import { Listener, subject, PaymentCreatedEvent, orderStatus } from "@akticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { queue } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: subject.PaymentCreated = subject.PaymentCreated;
  queue = queue;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not Found");
    }
    order.set({ status: orderStatus.Completed });
    await order.save();

    msg.ack();
  }
}
