import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import { Ticket } from "../models/tickets";

jest.mock("../nats-wrapper");

declare global {
  var signin: () => string;
  var createTicket: () => Promise<string>;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "admin";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (): string => {
  const id = Math.trunc(Math.random() * 100).toString();
  const payload = {
    id: id,
    email: "test@test.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = {
    jwt: token,
  };

  const sessionJSON = JSON.stringify(session);

  const sessionEncoded = Buffer.from(sessionJSON).toString("base64");
  return `session=${sessionEncoded}`;
};

global.createTicket = async (): Promise<string> => {
  const id = Math.trunc(Math.random() * 5).toString();
  const ticket = Ticket.build({ title: "concert", price: 4, userId: id });
  await ticket.save();
  return ticket.id;
};
