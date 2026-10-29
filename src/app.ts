import "dotenv/config";
import express from "express";
import prisma from "./config/prisma";
import { errorHandler, notFound } from "./middlewares/error";
import { logger } from "./middlewares/logger";
import heroRoutes from "./routes/hero.routes";
import playerRoutes from "./routes/player.routes";
import purchaseRoutes from "./routes/purchase.routes";
import skinRoutes from "./routes/skin.routes";
import statisticRoutes from "./routes/statistic.routes";

const app = express();

app.use(express.json());
app.use(logger);

// Health check endpoint
app.get("/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: true, message: "Server dan database OK" });
  } catch (error) {
    next(error);
  }
});

// Pendaftaran route secara terpisah
app.use("/api/heroes", heroRoutes);
app.use("/api/skins", skinRoutes);
app.use("/api/players", purchaseRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/statistics", statisticRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
