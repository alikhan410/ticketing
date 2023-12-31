import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  orderStatus,
  requireAuth,
  validator,
} from "@akticket/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events/publisher/payment-created-publisher";
import { Order } from "../models/orders";
import { Payment } from "../models/payments";
import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe/stripe";

const route = express.Router();

route.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("Not a valid id"),
    body("orderId").not().isEmpty().withMessage("Not a valid id"),
  ],
  validator,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === orderStatus.Cancelled) {
      throw new BadRequestError("Can not pay for a cancelled order");
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { route as createChargeRouter };
