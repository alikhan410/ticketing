import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, orderStatus } from "../../models/orders";
import { Ticket, ticketsDoc } from "../../models/tickets";
import { natsWrapper } from "../../nats-wrapper";

const createTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 19,
  });
  await ticket.save();
  return ticket;
};

const createOrder = async (ticket: ticketsDoc) => {
  const order = Order.build({
    expiresAt: new Date(),
    userId: "sdasda",
    status: orderStatus.Created,
    ticket: ticket,
  });

  await order.save();
  return order;
};

it("returns 404 when ticket is not found", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticketId.toString() })
    .expect(404);
});

it("returns 400 if ticket is reserved", async () => {
  const ticket = await createTicket();

  await createOrder(ticket);

  const user = global.signin();

  await request(app).post("/api/orders").set("Cookie", user).send({ ticketId: ticket.id }).expect(400);
});

it("returns 201 if order is created", async () => {
  const ticket = await createTicket();

  const user = global.signin();

  await request(app).post("/api/orders").set("Cookie", user).send({ ticketId: ticket.id }).expect(201);
});

it("sends an order:created event", async () => {
  const ticket = await createTicket();

  const user = global.signin();

  await request(app).post("/api/orders").set("Cookie", user).send({ ticketId: ticket.id }).expect(201);

  expect(natsWrapper.client.publish).toBeCalled();
});
