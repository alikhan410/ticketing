import { OrderCancelledEvent } from "@akticket/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "concert",
    price: 15,
    userId: "asd",
  });

  ticket.orderId = new mongoose.Types.ObjectId().toHexString();

  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: ticket.orderId,
    ticket: {
      id: ticket.id,
    },
    version: ticket.version,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, ticket, msg, listener };
};

it("un-reserves the ticket", async () => {
  const { data, ticket, msg, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
