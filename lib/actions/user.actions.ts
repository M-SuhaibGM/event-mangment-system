'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma' // Your Prisma client instance
import { handleError } from '@/lib/utils'
import { CreateUserParams, UpdateUserParams } from '@/types'

export async function createUser(user: CreateUserParams) {
  try {
    const newUser = await prisma.user.create({
      data: {
        id: user.clerkId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        image: user.photo,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Include related events or orders if needed
    })

    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUser(id: string, user: UpdateUserParams) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: `${user.firstName} ${user.lastName}`,
        image: user.photo,
        // Update other fields
      }
    })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteUser(id: string) {
  try {
    const userToDelete = await prisma.user.findUnique({ where: { id } })
    if (!userToDelete) throw new Error('User not found')

    // 1. Define a constant ID for a placeholder user (e.g., 'deleted-user-id')
    // You should create this user once in your database manually.
    const GHOST_USER_ID = 'system-deleted-user';

    await prisma.$transaction([
      // Reassign instead of unlinking
      prisma.event.updateMany({
        where: { organizerId: id },
        data: { organizerId: GHOST_USER_ID }
      }),
      prisma.order.updateMany({
        where: { buyerId: id },
        data: { buyerId: GHOST_USER_ID }
      }),
      prisma.user.delete({
        where: { id }
      })
    ])

    revalidatePath('/')
    return { message: "User deleted successfully" }
  } catch (error) {
    handleError(error)
  }
}