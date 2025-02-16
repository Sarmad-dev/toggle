import { File } from "lucide-react";
import type { ChatMessage } from "@/types/global";
import Image from "next/image";

export function MessageContent({ message }: { message: ChatMessage }) {
  if (message.fileUrl) {
    if (message.fileType?.startsWith("image/")) {
      return (
        <div
          className="mt-2"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          <Image
            src={message.fileUrl} // URL of the image from Supabase Storage
            alt={message.fileName as string} // Alt text for accessibility
            layout="responsive" // Ensures the image maintains its aspect ratio
            width={16} // Placeholder value (will be overridden by intrinsic size)
            height={9} // Placeholder value (will be overridden by intrinsic size)
            objectFit="cover" // Ensures the image covers the container without distortion
            priority={false} // Optional: Set to true if the image is above the fold
          />
        </div>
      );
    }
    return (
      <div className="mt-2">
        <a
          href={message.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-500 hover:underline"
        >
          <File className="h-4 w-4" />
          {message.fileName}
        </a>
      </div>
    );
  }

  return <div>{message.content}</div>;
}
