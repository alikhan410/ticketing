import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";

it("returns 404 when ticket doesnt exists", async () => {
  const ObjectId = mongoose.Types.ObjectId;
  const randomObjectId = new ObjectId();
  const id = randomObjectId.toString();

  await request(app).get(`/api/tickets/${id}`).expect(404);
});

it("returns 200 when succeeds", async () => {
  const response1 = await request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "some ticket",
    price: 98,
  });

  const ticket = await Ticket.findById(response1.body.id);

  const id = ticket?._id.toString();

  const response2 = await request(app).get(`/api/tickets/${id}`);

  expect(response1.body).toEqual(response2.body);
});
