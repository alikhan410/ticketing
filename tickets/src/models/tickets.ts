import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface ticketsAttrs {
  title: string;
  price: Number;
  userId: string;
}

interface ticketsDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface ticketModel extends mongoose.Model<ticketsDoc> {
  build(attrs: ticketsAttrs): ticketsDoc;
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
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

ticketSchema.statics.build = (attrs: ticketsAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<ticketsDoc, ticketModel>("Ticket", ticketSchema);

export { Ticket };
