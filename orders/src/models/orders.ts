import mongoose from "mongoose";
import { ticketsDoc } from "./tickets";
import { orderStatus } from "@akticket/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { orderStatus };

interface orderAttrs {
  userId: string;
  status: orderStatus;
  expiresAt: Date;
  ticket: ticketsDoc;
}

interface orderDoc extends mongoose.Document {
  userId: string;
  status: orderStatus;
  expiresAt: Date;
  ticket: ticketsDoc;
  version: number;
}

interface orderModel extends mongoose.Model<orderDoc> {
  build(attrs: orderAttrs): orderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(orderStatus),
      default: orderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    versionKey: "version",
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: orderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<orderDoc, orderModel>("Order", orderSchema);

export { Order };
