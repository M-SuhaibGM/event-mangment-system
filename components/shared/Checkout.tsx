'use client'

import { Event } from '@/lib/generated/prisma/client';
import { Button } from '../ui/button';
import { checkoutEventTicket } from '@/lib/actions/checkout.actions';
import { useEffect } from 'react';

const Checkout = ({ event, userId }: { event: Event, userId: string }) => {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) alert('🎉 Ticket purchased successfully!');
    if (query.get('canceled')) alert('Payment was canceled.');
  }, []);

  const onCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (event.isFree) {
      // handle free ticket logic here
      return;
    }

    await checkoutEventTicket({
      eventId: String(event.id),
      stripePriceId: event.stripePriceId!,
      buyerId: userId,
    });
  };

  return (
    <form onSubmit={onCheckout}>
      <Button type="submit" size="lg" className="button sm:w-fit">
        {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
      </Button>
    </form>
  );
};

export default Checkout;