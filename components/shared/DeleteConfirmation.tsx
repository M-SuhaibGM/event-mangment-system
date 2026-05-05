'use client'

import { useTransition } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner' // Added for feedback

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
} from '@/components/ui/alert-dialog'

import { deleteEvent } from '@/lib/actions/event.actions'

export const DeleteConfirmation = ({ eventId }: { eventId: string }) => {
  const pathname = usePathname()
  let [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteEvent({ eventId, path: pathname })
        toast.success('Event deleted successfully')
      } catch (error) {
        toast.error('Failed to delete event')
        console.error(error)
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center">
        <Image 
          src="/assets/icons/delete.svg" 
          alt="delete" 
          width={20} 
          height={20} 
          className="cursor-pointer hover:scale-110 transition-transform"
        />
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription className="p-regular-16 text-grey-600">
            This will permanently delete this event from the database. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault() // Prevent closing early if logic is running
              handleDelete()
            }}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}