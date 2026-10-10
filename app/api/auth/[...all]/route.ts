import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/packages/db/auth/auth";

export const { GET, POST } = toNextJsHandler(auth);