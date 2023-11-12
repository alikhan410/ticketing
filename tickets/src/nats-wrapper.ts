import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("NATS client is not connected");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Nats is connected");
        resolve();
        this.client.on("error", (err) => reject(err));
      });
    });
  }
}

const natsWrapper = new NatsWrapper();
export { natsWrapper };
