import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";

it("returns 200 when successful", async () => {
  await request(app).get("/api/tickets").expect(200);
});
it("returns all tickets", async () => {
  await global.createTicket();
  await global.createTicket();
  await global.createTicket();

  const response = await request(app).get("/api/tickets");

  expect(response.body.length).toEqual(3);
});
