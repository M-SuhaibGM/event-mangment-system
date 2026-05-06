// app/events/[id]/success/page.tsx
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia" as any,
});

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { session_id: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) redirect(`/events/${params.id}`);

  // Ask Stripe directly — no webhook needed
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    const { eventId, buyerId } = session.metadata!;

    // Prevent duplicate orders on page refresh
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">🎉 Payment Successful!</h1>
      <p className="text-gray-600 mt-2">Your ticket has been confirmed.</p>
      <a href={`/events/${params.id}`} className="mt-6 text-blue-500 underline">
        Back to Event
      </a>
    </div>
  );
}