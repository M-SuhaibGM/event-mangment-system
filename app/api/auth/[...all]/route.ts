import { auth } from "@/lib/auth"; // Import your auth config
import { toNextJsHandler } from "better-auth/next-js";

// This exports the GET and POST handlers that better-auth uses
// to create virtual endpoints like /api/auth/stripe/create-checkout-session
export const { GET, POST } = toNextJsHandler(auth);