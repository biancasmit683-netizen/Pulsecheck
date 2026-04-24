import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env.js";
import { supabase } from "./db/client.js";

/**
 * Builds and configures the Fastify app but does NOT start listening.
 *
 * Used by both:
 * - Local dev (src/index.ts calls .listen())
 * - Vercel serverless (api/index.ts wraps it in a handler)
 */
export async function buildServer(): Promise<FastifyInstance> {
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

  /**
   * Pings Supabase. Tries to read one row from `sessions`.
   * Returns `db: "ok"` when the schema is applied, `db: "missing"` if the
   * table doesn't exist yet, `db: "error"` on any other failure.
   */
  app.get("/health/db", async () => {
    const { error } = await supabase.from("sessions").select("id").limit(1);

    if (!error) {
      return { status: "ok", db: "ok", time: new Date().toISOString() };
    }

    const missingTable =
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      /relation .* does not exist/i.test(error.message) ||
      /Could not find the table/i.test(error.message);

    return {
      status: "degraded",
      db: missingTable ? "missing" : "error",
      detail: error.message,
      hint: missingTable
        ? "Run apps/api/src/db/migrations/0001_initial_schema.sql in the Supabase SQL editor."
        : undefined,
      time: new Date().toISOString(),
    };
  });

  // Endpoint stubs arrive in Phase 3.

  return app;
}
