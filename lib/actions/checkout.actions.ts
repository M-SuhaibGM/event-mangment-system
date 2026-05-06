'use server'

import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia" as any,
});

export async function createStripePrice({
    eventTitle,
    price,
}: {
    eventTitle: string;
    price: string;
}) {
    const product = await stripe.products.create({ name: eventTitle });

    const stripePrice = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(parseFloat(price) * 100),
        currency: "usd",
    });

    return stripePrice.id;
}

export async function checkoutEventTicket({
    eventId,
    stripePriceId,
    buyerId,
}: {
    eventId: string;
    stripePriceId: string;
    buyerId: string;
}) {
    // ← Guard: catch missing price ID before hitting Stripe
    if (!stripePriceId) {
        throw new Error("This event does not have a Stripe price configured yet.");
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: stripePriceId, quantity: 1 }],
        metadata: { eventId, buyerId },
        // lib/actions/checkout.actions.ts
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}?canceled=true`,
    });

    redirect(session.url!);
}