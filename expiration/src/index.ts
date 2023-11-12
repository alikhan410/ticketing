import { OrderCreatedListener } from "./events/listener/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

(async () => {
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

  new OrderCreatedListener(natsWrapper.client).listen();
})();
