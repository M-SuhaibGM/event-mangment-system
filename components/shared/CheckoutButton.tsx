"use client"

import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Checkout from './Checkout'
import { useSession } from "@/lib/auth-client";

// Update prop type to match your Prisma/MySQL event structure
const CheckoutButton = ({ event }: { event: any }) => {
  // 1. Get session using the Better Auth client hook
  const { data: session, isPending } = useSession();

  const userId = session?.user?.id as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  // Handle loading state to prevent layout shift
  if (isPending) return <div className="h-10 w-24 animate-pulse rounded-full bg-grey-50" />;

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">Sorry, tickets are no longer available.</p>
      ) : (
        <>
          {/* Equivalent to <SignedOut> */}
          {!session ? (
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">
                Get Tickets
              </Link>
            </Button>
          ) : (
            /* Equivalent to <SignedIn> */
            <Checkout event={event} userId={userId} />
          )}
        </>
      )}
    </div>
  )
}

export default CheckoutButton