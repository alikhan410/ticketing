import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from "../../nats-wrapper";

it("Can only be accessed if the user is signed in", async () => {
  await request(app).put("/api/tickets/asd6as6").send({}).expect(401);
});

it("Returns a status code other than 401 if user is signed in", async () => {
  const response = await request(app).put("/api/tickets/56asd54").set("Cookie", global.signin());
  expect(response.statusCode).not.toEqual(401);
});

it("returns 400 if invalid inputs are provided", async () => {
  const user = global.signin();

  await request(app)
    .put("/api/tickets/asdsa")
    .set("Cookie", user)
    .send({
      title: 545,
      price: 55,
    })
    .expect(400);

  await request(app)
    .put("/api/tickets/sadas")
    .set("Cookie", user)
    .send({
      price: 55,
    })
    .expect(400);

  await request(app)
    .put("/api/tickets/asdasd")
    .set("Cookie", user)
    .send({
      title: 545,
      price: "sadsd",
    })
    .expect(400);

  await request(app)
    .put("/api/tickets/sadasd")
    .set("Cookie", user)
    .send({
      title: 545,
    })
    .expect(400);
});

it("Return 401 if user is not authorized to update a ticket", async () => {
  const user1 = global.signin();
  const user2 = global.signin();

  const response1 = await request(app).post("/api/tickets").set("Cookie", user1).send({
    title: "some ticket",
    price: 98,
  });

  const ticket = await Ticket.findById(response1.body.id);

  await request(app)
    .put(`/api/tickets/${ticket?.id}`)
    .set("Cookie", user2)
    .send({
      title: "test",
      price: 10,
    })
    .expect(401);
});

it("Return 204 if user successfully updates the ticket", async () => {
  const user = global.signin();

  const response1 = await request(app).post("/api/tickets").set("Cookie", user).send({
    title: "some ticket",
    price: 98,
  });

  let ticket = await Ticket.findById(response1.body.id);

  await request(app)
    .put(`/api/tickets/${ticket?.id}`)
    .set("Cookie", user)
    .send({
      title: "test",
      price: 10,
    })
    .expect(204);

  ticket = await Ticket.findById(response1.body.id);
  console.log(ticket);
});

it("calls the natsWrapper.client.publish twice", async () => {
  const user = global.signin();

  const response1 = await request(app).post("/api/tickets").set("Cookie", user).send({
    title: "some ticket",
    price: 98,
  });

  const ticket = await Ticket.findById(response1.body.id);

  await request(app)
    .put(`/api/tickets/${ticket?.id}`)
    .set("Cookie", user)
    .send({
      title: "test",
      price: 10,
    })
    .expect(204);

  expect(natsWrapper.client.publish).toBeCalledTimes(2);
});

it("rejects update if the ticket is reserved", async () => {
  const user = global.signin();

  const response = await request(app).post("/api/tickets").set("Cookie", user).send({
    title: "some ticket",
    price: 98,
  });

  const ticket = await Ticket.findById(response.body.id);

  ticket!.orderId = "sds";

  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${ticket?.id}`)
    .set("Cookie", user)
    .send({
      title: "test",
      price: 10,
    })
    .expect(400);
});
