'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma' // Ensure you have a prisma client instance here
import { handleError } from '@/lib/utils'

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from '@/types'

// Helper to include related data (Replaces Mongoose .populate)
const eventInclude = {
  category: {
    select: { id: true, name: true }
  },
  organizer: {
    select: { id: true, name: true, image: true } // Better Auth uses 'image' instead of 'photo'
  }
}

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    const newEvent = await prisma.event.create({
      data: {
        ...event,
        categoryId: event.categoryId,
        organizerId: userId,
      }
    })

    revalidatePath(path)
    return newEvent
  } catch (error) {
    handleError(error)
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: eventInclude
    })

    if (!event) throw new Error('Event not found')

    return event
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    const eventToUpdate = await prisma.event.findUnique({
      where: { id: event.id }
    })

    if (!eventToUpdate || eventToUpdate.organizerId !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    const updatedEvent = await prisma.event.update({
      where: { id: event.id },
      data: {
        ...event,
        categoryId: event.categoryId,
      }
    })

    revalidatePath(path)
    return updatedEvent
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    const deletedEvent = await prisma.event.delete({
      where: { id: eventId }
    })

    if (deletedEvent) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}

// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    const skipAmount = (Number(page) - 1) * limit

    // Build the WHERE clause for MySQL
    const where = {
      AND: [
        query ? { title: { contains: query } } : {}, // MySQL 'contains' is similar to $regex
        category ? { category: { name: { contains: category } } } : {},
      ]
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: skipAmount,
      take: limit,
      include: eventInclude
    })

    const eventsCount = await prisma.event.count({ where })

    return {
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    const skipAmount = (Number(page) - 1) * limit
    const where = { organizerId: userId }

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: skipAmount,
      take: limit,
      include: eventInclude
    })

    const eventsCount = await prisma.event.count({ where })

    return { 
      data: events, 
      totalPages: Math.ceil(eventsCount / limit) 
    }
  } catch (error) {
    handleError(error)
  }
}

// GET RELATED EVENTS
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    const skipAmount = (Number(page) - 1) * limit
    const where = {
      AND: [
        { categoryId: categoryId },
        { id: { not: eventId } }
      ]
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: skipAmount,
      take: limit,
      include: eventInclude
    })

    const eventsCount = await prisma.event.count({ where })

    return { 
      data: events, 
      totalPages: Math.ceil(eventsCount / limit) 
    }
  } catch (error) {
    handleError(error)
  }
}