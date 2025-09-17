import "dotenv/config";
import express, { Express } from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";

import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";

import userRouter from "./routes/userRouter.js";
import invoiceRouter from "./routes/invoiceRouter.js";
import authRouter from "./routes/authRouter.js";
import aiRouter from "./routes/aiRouter.js";

const app: Express = express();
const port = process.env.PORT || 5100;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Updated CORS configuration for separate deployments
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL // Your deployed Angular app URL
        : ["http://localhost:4200", "http://127.0.0.1:4200"], // Local Angular dev server
    credentials: false, // Changed to false since we're not using cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allow Authorization header for JWT
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health check endpoint (useful for deployment platforms)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// ------------ ROUTES ------------
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/ai", aiRouter);

// ------------ ERROR HANDLING ------------
app.use("*", (req, res) => {
  res.status(404).json({
    message: "API route not found",
    availableRoutes: ["/api/auth", "/api/users", "/api/invoices", "/api/ai"],
  });
});

app.use(errorHandlerMiddleware);

try {
  await mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
