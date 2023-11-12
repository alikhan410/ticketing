import express, { Request, Response } from "express";
import { requireAuth, validator } from "@akticket/common";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const route = express.Router();

route.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Provide a valid title"),
    body("price").isFloat({ gt: 0 }).withMessage("Provide a valid price"),
  ],
  validator,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser?.id!,
    });

    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { route as createTicketRouter };
