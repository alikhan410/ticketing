import { orderStatus } from "@akticket/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface paymentAttrs {
  orderId: string;
  stripeId: string;
}
interface paymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
  version: number;
}
interface paymentModel extends mongoose.Model<paymentDoc> {
  build(attrs: paymentAttrs): paymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
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

paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attrs: paymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<paymentDoc, paymentModel>("Payment", paymentSchema);

export { Payment };
