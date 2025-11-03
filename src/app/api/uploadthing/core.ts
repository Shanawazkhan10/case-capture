import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { z } from 'zod'
import sizeOf from 'image-size'
import { db } from '@/db'
// import sizeOf from "image-size";

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      return { input }
    })


.onUploadComplete(async ({ metadata, file }) => {
  try {
    const { configId } = metadata.input;

    // Fetch and convert image to buffer
    const res = await fetch(file.url);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get image dimensions safely
    const { width, height } = sizeOf(buffer);

    if (!configId) {
      const configuration = await db.configuration.create({
        data: {
          imageUrl: file.url,
          width: width ?? 500,
          height: height ?? 500,
        },
      });

      return { configId: configuration.id };
    } else {
      const updatedConfiguration = await db.configuration.update({
        where: { id: configId },
        data: { croppedImageUrl: file.url },
      });

      return { configId: updatedConfiguration.id };
    }
  } catch (error) {
    console.error("UploadThing onUploadComplete error:", error);
    throw new Error("Failed to process image upload");
  }
})

} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
