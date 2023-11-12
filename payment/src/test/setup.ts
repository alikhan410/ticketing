import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

jest.mock("../nats-wrapper");
process.env.STRIPE_KEY =
  "sk_test_51OAMLgJlzKJeJaWJbnUbmnEtwue7HbBcNCEoWIfZIC1Y8nD5S2WfgypjmL1oGz2BsG54CLRyhOTHqIVf7ZrQY6yp00dDY2aH4o";
declare global {
  var signin: (userId: string) => string;
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

global.signin = (userId): string => {
  const id = userId;
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
