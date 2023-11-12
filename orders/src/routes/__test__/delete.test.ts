import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket, ticketsDoc } from "../../models/tickets";
import { natsWrapper } from "../../nats-wrapper";

const createTicket = async (): Promise<ticketsDoc> => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 19,
  });
  await ticket.save();
  return ticket;
};

it("return 404 if order is not found", async () => {
  const orderId = new mongoose.Types.ObjectId();

  const userOne = global.signin();

  await request(app).delete(`/api/orders/${orderId.toString()}`).set("Cookie", userOne).expect(404);
});

it("return 401 if userOne try to delete UserTwo order", async () => {
  const ticketOne = await createTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  const responseOne = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const orderId = responseOne.body.id;

  await request(app).delete(`/api/orders/${orderId}`).set("Cookie", userTwo).expect(401);
});

it("return 204 and cancels user's orders", async () => {
  const ticketOne = await createTicket();

  const userOne = global.signin();

  const responseOne = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const orderId = responseOne.body.id;

  await request(app).delete(`/api/orders/${orderId}`).set("Cookie", userOne).expect(204);
});

it("sends an order cancelled event", async () => {
  const ticketOne = await createTicket();

  const userOne = global.signin();

  const responseOne = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const orderId = responseOne.body.id;

  await request(app).delete(`/api/orders/${orderId}`).set("Cookie", userOne).expect(204);

  expect(natsWrapper.client.publish).toBeCalled();
});
