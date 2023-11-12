import { NotFoundError } from "@akticket/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models/tickets";

const route = express.Router();

route.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { route as showTicketRouter };
