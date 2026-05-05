import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: { // [!code ++]
        google: { // [!code ++]
            clientId: process.env.GOOGLE_CLIENT_ID as string, // [!code ++]
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // [!code ++]
        }, // [!code ++]
    }, // [!code ++]
});