import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  APP_FRONTEND_ORIGIN: z.string().url().default("http://localhost:5173"),
  FLOW_CONFIG_PATH: z.string().default("../../config/03-INTERVIEW-FLOW.json"),

  // All of these are optional during Phase 1 so the server boots without them.
  // Phases 2+ will tighten these as each integration comes online.
  ANTHROPIC_API_KEY: z.string().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  GOOGLE_SERVICE_ACCOUNT_JSON: z.string().optional(),
  METRIC_SHEET_ID: z.string().optional(),
  DRIVE_SESSIONS_FOLDER_ID: z.string().optional(),
  DRIVE_CLIENT_TEMPLATE_FILE_ID: z.string().optional(),
  DRIVE_BRIEF_TEMPLATE_FILE_ID: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  NOTIFICATION_EMAILS: z.string().optional(),
  ADMIN_PAGE_PASSWORD_HASH: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);

export const notificationRecipients = (): string[] =>
  (env.NOTIFICATION_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
