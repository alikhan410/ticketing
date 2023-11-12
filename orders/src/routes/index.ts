import { requireAuth } from "@akticket/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orders";

const route = express.Router();

route.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser?.id }).populate("ticket");
  res.send(orders);
});

export { route as indexOrderRouter };
