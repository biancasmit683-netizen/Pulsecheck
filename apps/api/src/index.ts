import "./config/bootEnv.js";
import { env } from "./config/env.js";
import { buildServer } from "./server.js";

/**
 * Local development entrypoint. Vercel uses api/index.ts instead.
 */
const app = await buildServer();

try {
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
