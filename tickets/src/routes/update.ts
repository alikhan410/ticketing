import express, { Request, Response } from "express";
import {
  BadRequestError,
  DatabaseConnectionError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validator,
} from "@akticket/common";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";

import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const route = express.Router();

route.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").isString().not().isEmpty().withMessage("Provide an valid title"),
    body("price").isFloat({ gt: 0 }).withMessage("Provide a valid price"),
  ],
  validator,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit, ticket is reserved");
    }

    if (req.currentUser?.id !== ticket.userId) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(204).send({});
  }
);

export { route as updateTicketRouter };
