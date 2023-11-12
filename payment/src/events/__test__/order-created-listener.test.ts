import { OrderCreateEvent, orderStatus, subject, TicketCreatedEvent } from "@akticket/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCreatedListener } from "../listener/order-created-listener";

const setup = () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreateEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      price: 55,
      id: new mongoose.Types.ObjectId().toHexString(),
    },
    expiresAt: "ss",
    userId: "651sd",
    version: 0,
    status: orderStatus.Created,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, listener, msg };
};

it("creates and saves a order", async () => {
  const { listener, data, msg } = setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order).toBeDefined();
});
