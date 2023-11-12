import express from "express";
import "express-async-errors";

import cookieSession from "cookie-session";

import { signupRoute } from "./routes/signup";
import { signinRoute } from "./routes/signin";
import { signoutRoute } from "./routes/signout";
import { currentUserRoute } from "./routes/current-user";

import { NotFoundError, errorHandler } from "@akticket/common";

const app = express();
app.set("trust proxy", true); // trust first proxy
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
); // config for a session object inside a cookie.

app.use(signupRoute);
app.use(signinRoute);
app.use(signoutRoute);
app.use(currentUserRoute);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
