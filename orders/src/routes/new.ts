import { BadRequestError, NotFoundError, requireAuth, validator } from "@akticket/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { Order, orderStatus } from "../models/orders";
import { Ticket } from "../models/tickets";
import { natsWrapper } from "../nats-wrapper";

const route = express.Router();

const EXPIRATION_WINDOW_TIME = 1;

route.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").isMongoId().not().isEmpty().withMessage("Not a valid id")],
  validator,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const existingOrder = await ticket.isReserved();
    if (existingOrder) {
      throw new BadRequestError("Ticket is reserved");
    }
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + EXPIRATION_WINDOW_TIME);

    const order = Order.build({
      userId: req.currentUser?.id!,
      expiresAt,
      status: orderStatus.Created,
      ticket,
    });

    await order.save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      status: orderStatus.Created,
      expiresAt: expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      version: order.version,
    });

    //send back res
    res.status(201).send(order);
  }
);

export { route as newOrderRouter };
