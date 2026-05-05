import { auth } from "@/lib/auth"; // Your Better Auth server instance
import { toNextJsHandler } from "better-auth/next-js";

// This handler handles GET and POST for ALL auth paths
export const { GET, POST } = toNextJsHandler(auth);