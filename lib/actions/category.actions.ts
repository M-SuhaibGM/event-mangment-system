"use server"

import { CreateCategoryParams } from "@/types"
import { handleError } from "../utils"
import { prisma } from "@/lib/prisma" // Ensure this points to your Prisma client instance

export const createCategory = async ({ categoryName }: CreateCategoryParams) => {
  try {
    // Prisma equivalent of Category.create
    const newCategory = await prisma.category.create({
      data: {
        name: categoryName,
      },
    });

    // Prisma returns a plain JS object, so JSON.parse(JSON.stringify()) is no longer needed
    return newCategory;
  } catch (error) {
    handleError(error)
  }
}

export const getAllCategories = async () => {
  try {
    // Prisma equivalent of Category.find()
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc', // Optional: Keeps your UI dropdowns alphabetized
      },
    });

    return categories;
  } catch (error) {
    handleError(error)
  }
}