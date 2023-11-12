import express, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";

import { BadRequestError, validator } from "@akticket/common";

import { User } from "../models/User";
import { Password } from "../services/password";

const route = express.Router();
route.post(
  "/api/user/signin",
  [
    body("email").isEmail().withMessage("Not a valid email"),
    body("password").trim().notEmpty().withMessage("Not a valid password"),
  ],
  validator,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentails");
    }
    const passwordMatch = await Password.compare(existingUser.password, password);
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentails");
    }

    const userJwt = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_KEY!);

    req.session = {
      jwt: userJwt,
    };
    res.status(200).send({});
  }
);

export { route as signinRoute };
