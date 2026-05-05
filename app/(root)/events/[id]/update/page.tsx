import EventForm from "@/components/shared/EventForm"
import { getEventById } from "@/lib/actions/event.actions"
import { auth } from "@/lib/auth"; // Your Better Auth instance
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type UpdateEventProps = {
  params: Promise<{
    id: string
  }>
}

const UpdateEvent = async ({ params }: UpdateEventProps) => {
  // 1. Await params for Next.js 15 compatibility
  const { id } = await params;

  // 2. Get the session using Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 3. Security Check: Redirect if not logged in
  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const event = await getEventById(id);

  // 4. Ownership Check (Optional but Recommended): 
  // Ensure the person trying to edit is the one who created it
  if (event?.organizerId !== userId) {
    redirect(`/events/${id}`);
  }

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
      </section>

      <div className="wrapper my-8">
        <EventForm
          type="Update"
          event={event}
          eventId={event.id} // Changed from _id to id for MySQL
          userId={userId}
        />
      </div>
    </>
  )
}

export default UpdateEvent