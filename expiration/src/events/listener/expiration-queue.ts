import Queue from "bull";
import { natsWrapper } from "../../nats-wrapper";
import { OrderExpirationPublisher } from "../publisher/order-expiration-publisher";

interface payload {
  orderId: string;
}

const expirationQueue = new Queue<payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new OrderExpirationPublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
