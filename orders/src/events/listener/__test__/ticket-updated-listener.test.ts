import { TicketUpdatedEvent } from "@akticket/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 25,
  });

  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "new concert",
    price: 10,
    userId: "sds",
    version: ticket.version + 1,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { ticket, msg, listener, data };
};

it("updated the ticket", async () => {
  const { ticket, msg, listener, data } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { msg, listener, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});

it("does not ack the msg if there's a skipped version", async () => {
  const { msg, listener, data } = await setup();

  data.version = 10;

  await expect(listener.onMessage(data, msg)).rejects.toThrow();
  expect(msg.ack).not.toHaveBeenCalled();
});
