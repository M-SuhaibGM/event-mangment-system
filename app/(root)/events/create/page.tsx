import EventForm from "@/components/shared/EventForm"
import { auth } from "@/lib/auth"; // Your Better Auth instance
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const CreateEvent = async () => {
  // 1. Get the session using Better Auth server-side API
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Safety check: Redirect if not authenticated
  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Create Event</h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userId} type="Create" />
      </div>
    </>
  )
}

export default CreateEvent