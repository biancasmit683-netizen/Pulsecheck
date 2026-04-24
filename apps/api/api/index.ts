import "../src/config/bootEnv.js";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { FastifyInstance } from "fastify";
import { buildServer } from "../src/server.js";

/**
 * Vercel serverless entrypoint.
 *
 * Vercel invokes this for every HTTP request that matches vercel.json's
 * rewrites. We build the Fastify app once per cold start and reuse it for
 * subsequent warm invocations.
 */
let appPromise: Promise<FastifyInstance> | null = null;

async function getApp(): Promise<FastifyInstance> {
  if (!appPromise) {
    appPromise = (async () => {
      const app = await buildServer();
      await app.ready();
      return app;
    })();
  }
  return appPromise;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const app = await getApp();
  app.server.emit("request", req, res);
}
