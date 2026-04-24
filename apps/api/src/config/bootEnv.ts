/**
 * Loads `.env` from the repo root so local dev finds SUPABASE_* etc.
 * In production (Vercel), real env vars are already set; dotenv is a no-op
 * for any key already defined.
 *
 * MUST be imported before anything that reads `process.env` (e.g. ./env.js).
 */
import { config as loadDotenv } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
// src/config/bootEnv.ts → src/config → src → apps/api → apps → repo root
const repoRoot = resolve(here, "..", "..", "..", "..");

loadDotenv({ path: resolve(repoRoot, ".env") });
