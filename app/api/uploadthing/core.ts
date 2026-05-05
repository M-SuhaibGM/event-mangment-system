import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth"; // Your Better Auth instance
import { headers } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {
  // Define the route for event images
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // 1. Get the session from Better Auth
      // We use headers() because UploadThing middleware runs in a standard server context
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      // 2. If no session, block the upload
      if (!session) throw new Error("Unauthorized");

      // 3. Return metadata to be used in onUploadComplete
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // Return value is sent to the client-side onClientUploadComplete
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;