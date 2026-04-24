import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env.js";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
    base: { service: "pulse-check-api" },
  },
});

await app.register(cors, {
  origin: env.APP_FRONTEND_ORIGIN,
  credentials: true,
});

app.get("/health", async () => ({
  status: "ok",
  service: "pulse-check-api",
  time: new Date().toISOString(),
}));

// Endpoint stubs arrive in Phase 3.

try {
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
