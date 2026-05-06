import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia" as any,
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mysql" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,

      // ← this handles saving the order after payment
      onEvent: async (event) => {
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;

          if (session.payment_status === "paid") {
            const { eventId, buyerId } = session.metadata ?? {};

            if (!eventId || !buyerId) return;

            const existing = await prisma.order.findUnique({
              where: { stripeId: session.id },
            });

            if (!existing) {
              await prisma.order.create({
                data: {
                  stripeId:    session.id,
                  totalAmount: String((session.amount_total ?? 0) / 100),
                  eventId,
                  buyerId,
                },
              });
            }
          }
        }
      },
    }),
  ],
});