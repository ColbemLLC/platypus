import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { db } from "@/packages/db";
import * as schema from "@/packages/db/schema";

// Social providers are only registered when their env vars exist,
// so the app still boots before the OAuth apps are created.
const social = (id?: string, secret?: string) =>
  id && secret ? { clientId: id, clientSecret: secret } : undefined;

const github = social(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET);
const google = social(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  // Password is collected in /onboarding. Email OTP verification is added later.
  emailAndPassword: { enabled: true },
  socialProviders: {
    ...(github && { github }),
    ...(google && { google }),
  },
  // nextCookies must stay last.
  plugins: [username(), nextCookies()],
});