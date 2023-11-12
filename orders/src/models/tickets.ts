import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, orderStatus } from "./orders";

interface ticketsAttrs {
  title: string;
  price: number;
  id: string;
}

export interface ticketsDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
  version: number;
}

interface ticketModel extends mongoose.Model<ticketsDoc> {
  build(attrs: ticketsAttrs): ticketsDoc;
  findByEvent(event: { id: string; version: number }): Promise<ticketsDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
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

ticketSchema.plugin(updateIfCurrentPlugin);

//We call this function on the model itself - Schema.statics.functionName
ticketSchema.statics.build = (attrs: ticketsAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = (event) => {
  return Ticket.findOne({ _id: event.id, version: event.version - 1 });
};

//We call this function on instance of a model - Schema.methods.functionName
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: { $in: [orderStatus.Created, orderStatus.AwaitingPayment, orderStatus.Completed] },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<ticketsDoc, ticketModel>("Ticket", ticketSchema);

export { Ticket };
