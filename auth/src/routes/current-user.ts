import express, { Request, Response } from "express";
import { currentUser, requireAuth } from "@akticket/common";

const route = express.Router();

route.get("/api/user/currentuser", currentUser, (req: Request, res: Response) => {
  res.status(200).send({ currentUser: req.currentUser || null });
});

export { route as currentUserRoute };
