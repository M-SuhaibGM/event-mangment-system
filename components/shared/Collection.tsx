import React from 'react'
import Card from './Card'
import Pagination from './Pagination'

// 1. Update the Import: Use your Prisma-aligned type instead of the Mongoose model
// If you have a global types file, import from there, otherwise define a light version:
interface EventProps {
  id: string;
  title: string;
  description: string | null; // Changed from ? to | null
  location: string | null;    // Changed from ? to | null
  createdAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string | null;       // Changed from ? to | null
  isFree: boolean;
  url: string | null;         // Changed from ? to | null
  category: { id: string, name: string };
  organizer: { id: string, name: string };
}

type CollectionProps = {
  data: EventProps[], // Use the updated interface
  emptyTitle: string,
  emptyStateSubtext: string,
  limit: number,
  page: number | string,
  totalPages?: number,
  urlParamName?: string,
  collectionType?: 'Events_Organized' | 'My_Tickets' | 'All_Events'
}

const Collection = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  collectionType,
  urlParamName,
}: CollectionProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {data.map((event) => {
              const hasOrderLink = collectionType === 'Events_Organized';
              const hidePrice = collectionType === 'My_Tickets';

              return (
                /* 2. Key Change: event.id instead of event._id */
                <li key={event.id} className="flex justify-center">
                  <Card event={event} hasOrderLink={hasOrderLink} hidePrice={hidePrice} />
                </li>
              )
            })}
          </ul>

          {totalPages > 1 && (
            <Pagination urlParamName={urlParamName} page={page} totalPages={totalPages} />
          )}
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
          <h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
          <p className="p-regular-14">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  )
}

export default Collection