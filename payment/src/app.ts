import express from "express";
import "express-async-errors";

import cookieSession from "cookie-session";

import { NotFoundError, errorHandler, currentUser } from "@akticket/common";
import { createChargeRouter } from "./route/new";

const app = express();
app.set("trust proxy", true); // trust first proxy
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
); // config for a session object inside a cookie.

// Looks if the user is signed in
app.use(currentUser);

//Routes
app.use(createChargeRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
