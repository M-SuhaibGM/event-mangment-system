"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { startTransition, useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "../ui/input"
import { createCategory, getAllCategories } from "@/lib/actions/category.actions"

// Define a clean interface for Prisma Category
interface CategoryItem {
  id: string;
  name: string;
}

type DropdownProps = {
  value?: string
  onChangeHandler?: (value: string) => void // Ensure the type accepts the string value
}

const Dropdown = ({ value, onChangeHandler }: DropdownProps) => {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = async () => {
    const trimmedName = newCategory.trim();
    if (!trimmedName) return;

    try {
      const category = await createCategory({
        categoryName: trimmedName
      });

      if (category) {
        // WRAP ONLY THE STATE UPDATE IN THE TRANSITION
        startTransition(() => {
          setCategories((prevState) => [...prevState, category]);
        });

        setNewCategory('');
      }
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  }

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      // Ensure we map the list to our CategoryItem interface
      if (categoryList) {
        setCategories(categoryList as CategoryItem[])
      }
    }

    getCategories();
  }, [])

  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 && categories.map((category) => (
          /* Changed from _id to id for Prisma compatibility */
          <SelectItem key={category.id} value={category.id} className="select-item p-regular-14">
            {category.name}
          </SelectItem>
        ))}

        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
            Add new category
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>New Category</AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  type="text"
                  placeholder="Category name"
                  className="input-field mt-3"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setNewCategory('')}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAddCategory}>
                Add
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  )
}

export default Dropdown