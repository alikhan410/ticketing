import { NotAuthorizedError, NotFoundError, orderStatus } from "@akticket/common";
import express, { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import { Order } from "../models/orders";
import { natsWrapper } from "../nats-wrapper";

const route = express.Router();

route.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  const order = await Order.findById(orderId).populate("ticket");

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser?.id) {
    throw new NotAuthorizedError();
  }

  order.set({ status: orderStatus.Cancelled });
  await order.save();

  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: { id: order.ticket.id },
    version: order.version,
  });

  res.status(204).send({});
});

export { route as deleteOrderRouter };
