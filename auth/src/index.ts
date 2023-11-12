import mongoose from "mongoose";
import { app } from "./app";

(async () => {
  console.log("app starting");
  if (!process.env.JWT_KEY) {
    throw new Error("env var not available: JWT_KEY");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("env var not available: MONGO_URI");
  }
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
  });
})();
