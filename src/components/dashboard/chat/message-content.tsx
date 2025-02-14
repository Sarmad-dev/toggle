import { File } from "lucide-react";
import type { ChatMessage } from "@/types/global";
import Image from "next/image";

export function MessageContent({ message }: { message: ChatMessage }) {
  if (message.fileUrl) {
    if (message.fileType?.startsWith('image/')) {
      return (
        <div className="mt-2">
          <Image 
            src={message.fileUrl} 
            alt={message.fileName as string}
            className="max-w-sm rounded-lg"
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