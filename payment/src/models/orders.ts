import { orderStatus } from "@akticket/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface orderAttrs {
  id: string;
  userId: string;
  price: number;
  status: orderStatus;
  version: number;
}
interface orderDoc extends mongoose.Document {
  id: string;
  userId: string;
  price: number;
  status: orderStatus;
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
    price: {
      type: Number,
      required: true,
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
  return new Order({
    _id: attrs.id,
    userId: attrs.userId,
    price: attrs.price,
    version: attrs.version,
    status: attrs.status,
  });
};

const Order = mongoose.model<orderDoc, orderModel>("Order", orderSchema);

export { Order };
