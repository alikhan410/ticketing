import { NotAuthorizedError, NotFoundError, requireAuth } from "@akticket/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orders";

const route = express.Router();

route.get("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  const userOrder = await Order.findById(orderId).populate("ticket");

  if (!userOrder) {
    throw new NotFoundError();
  }

  if (userOrder.userId !== req.currentUser?.id) {
    throw new NotAuthorizedError();
  }

  res.send(userOrder);
});

export { route as showOrderRouter };
