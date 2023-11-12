import { OrderCreateEvent, orderStatus, subject } from "@akticket/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "concert",
    price: 15,
    userId: "asd",
  });
  await ticket.save();

  const data: OrderCreateEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "ddd",
    status: orderStatus.Created,
    expiresAt: "someDateInUtcString",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    version: 0,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, ticket, msg, listener };
};

it("acks the message", async () => {
  const { data, ticket, msg, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { data, msg, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // console.log((natsWrapper.client.publish as jest.Mock).mock.calls);
});
