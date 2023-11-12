import mongoose from "mongoose";
import { app } from "./app";
import { OrderExpirationListener } from "./events/listener/expiration-completed-listener";
import { PaymentCreatedListener } from "./events/listener/payment-created-listener";
import { TicketCreatedListener } from "./events/listener/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listener/ticket-updated-listener";
import { natsWrapper } from "./nats-wrapper";

(async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("env var not available: JWT_KEY");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("env var not available: MONGO_URI");
  }
  if (!process.env.CLUSTER_ID) {
    throw new Error("env var not available: CLUSTER_ID");
  }
  if (!process.env.CLIENT_ID) {
    throw new Error("env var not available: CLIENT_ID");
  }
  if (!process.env.NATS_URI) {
    throw new Error("env var not available: NATS_URI");
  }

  await natsWrapper.connect(process.env.CLUSTER_ID, process.env.CLIENT_ID, process.env.NATS_URI);

  natsWrapper.client.on("close", () => {
    process.exit();
  });

  process.on("SIGINT", natsWrapper.client.close);
  process.on("SIGTERM", natsWrapper.client.close);

  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();
  new OrderExpirationListener(natsWrapper.client).listen();
  new PaymentCreatedListener(natsWrapper.client).listen();

  await mongoose.connect(process.env.MONGO_URI);

  app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
  });
})();
