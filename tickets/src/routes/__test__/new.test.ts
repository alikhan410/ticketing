import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from "../../nats-wrapper";

it("Has a route handler listeing to api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.statusCode).not.toEqual(404);
});

it("Can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("Returns a status code other than 401 if user is signed in", async () => {
  const response = await request(app).post("/api/tickets").set("Cookie", global.signin());
  expect(response.statusCode).not.toEqual(401);
});

it("returns 400 if invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: 5,
      price: 15,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 15,
    })
    .expect(400);
});

it("returns 400 if invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Ticket",
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Ticket",
      price: "sds",
    })
    .expect(400);
});

it("Creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "some ticket",
      price: 98,
    })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
});

it("calls the natsWrapper.client.publish once and sends ticket:created event to Nats", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "some ticket",
      price: 98,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toBeCalled();
});
