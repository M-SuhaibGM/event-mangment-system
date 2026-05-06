// scripts/fix-stripe-prices.ts
import Stripe from "stripe";
import { prisma } from "./lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia" as any,
});

async function fixStripePrices() {
    // Get all paid events with no stripePriceId
    const events = await prisma.event.findMany({
        where: {
            isFree: false,
            stripePriceId: null,
        },
    });

    console.log(`Found ${events.length} events without stripePriceId`);

    for (const event of events) {
        const product = await stripe.products.create({ name: event.title });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(parseFloat(event.price ?? "10") * 100),
            currency: "usd",
        });

        await prisma.event.update({
            where: { id: event.id },
            data: { stripePriceId: price.id },
        });

        console.log(`✅ Fixed: ${event.title} → ${price.id}`);
    }

    console.log("Done!");
}

fixStripePrices();