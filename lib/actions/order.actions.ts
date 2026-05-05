"use server"

import Stripe from 'stripe';
import { CheckoutOrderParams, CreateOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from "@/types"
import { redirect } from 'next/navigation';
import { handleError } from '../utils';
import { prisma } from '@/lib/prisma';

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const price = order.isFree ? 0 : Number(order.price) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price,
            product_data: {
              name: order.eventTitle
            }
          },
          quantity: 1
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!)
  } catch (error) {
    throw error;
  }
}

export const createOrder = async (order: CreateOrderParams) => {
  try {
    const newOrder = await prisma.order.create({
      data: {
        stripeId: order.stripeId,
        totalAmount: order.totalAmount,
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
    });

    return newOrder;
  } catch (error) {
    handleError(error);
  }
}

// GET ORDERS BY EVENT (Replaces Mongoose Aggregation)
export async function getOrdersByEvent({ searchString, eventId }: GetOrdersByEventParams) {
  try {
    if (!eventId) throw new Error('Event ID is required');

    const orders = await prisma.order.findMany({
      where: {
        eventId: eventId,
        buyer: {
          name: {
            contains: searchString, // MySQL case-insensitive search
          },
        },
      },
      include: {
        event: true,
        buyer: true,
      },
    });

    // Formatting output to match the expected frontend structure
    return orders.map((order) => ({
      _id: order.id,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      eventTitle: order.event.title,
      eventId: order.event.id,
      buyer: order.buyer.name,
    }));
  } catch (error) {
    handleError(error);
  }
}

// GET ORDERS BY USER
export async function getOrdersByUser({ userId, limit = 3, page }: GetOrdersByUserParams) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    const orders = await prisma.order.findMany({
      where: {
        buyerId: userId?.toString(),
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: skipAmount,
      take: limit,
      include: {
        event: {
          include: {
            organizer: {
              select: {
                id: true,
                name: true,
              },
            },
            category: true,
          },
        },
      },
    });

    const ordersCount = await prisma.order.count({
      where: { buyerId: userId?.toString() },
    });

    return {
      data: orders,
      totalPages: Math.ceil(ordersCount / limit)
    };
  } catch (error) {
    handleError(error);
  }
}