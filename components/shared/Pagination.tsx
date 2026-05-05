"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'
import { formUrlQuery } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react' // Added icons

type PaginationProps = {
  page: number | string,
  totalPages: number,
  urlParamName?: string
}

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onClick = (btnType: string) => {
    // Ensure we are working with numbers to avoid string concatenation bugs
    const currentPage = Number(page) || 1
    const pageValue = btnType === 'next' 
      ? currentPage + 1 
      : currentPage - 1

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    })

    router.push(newUrl, { scroll: false })
  }

  // If there's only one page, we don't need to show pagination at all
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 py-10">
      <Button
        size="sm" // Smaller buttons usually look better for pagination
        variant="outline"
        className="flex items-center gap-1 min-w-[100px]"
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
      >
        <ChevronLeft size={16} />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        <span className="p-medium-16 text-grey-600">
          Page {page} of {totalPages}
        </span>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-1 min-w-[100px]"
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  )
}

export default Pagination