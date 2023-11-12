import express, { Response, Request } from "express";

const route = express.Router();
route.get("/api/user/signout", (req: Request, res: Response) => {
  req.session = null;
  res.status(201).send({});
});

export { route as signoutRoute };
