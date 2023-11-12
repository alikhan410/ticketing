import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { body } from "express-validator";
import { User } from "../models/User";

import { BadRequestError, validator } from "@akticket/common";

const route = express.Router();

route.post(
  "/api/user/signup",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").trim().isLength({ min: 4, max: 32 }).withMessage("Invalid Password"),
  ],
  validator,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();

    const userJwt = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_KEY!);

    req.session = {
      jwt: userJwt,
    };
    res.status(201).send(user);
  }
);

export { route as signupRoute };
