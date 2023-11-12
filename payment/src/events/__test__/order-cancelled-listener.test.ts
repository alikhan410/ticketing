import { OrderCancelledEvent, orderStatus } from "@akticket/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledListener } from "../listener/order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const id = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: orderStatus.Created,
    price: 25,
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id,
    version: 1,
    ticket: { id: new mongoose.Types.ObjectId().toHexString() },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, listener, msg };
};

it("cancels the order", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.status).toEqual("cancelled");
});
