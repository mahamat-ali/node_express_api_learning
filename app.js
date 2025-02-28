import express from "express";
import { PORT, NODE_ENV } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";

const app = express();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.listen(PORT, async () => {
  console.log(`Subscription tracker running on http://localhost:${PORT}`);
  await connectToDatabase();
});
