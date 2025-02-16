"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, FileSpreadsheet, Presentation, File } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    url: string;
    type: string;
    name: string;
  };
}

export function FilePreviewModal({
  isOpen,
  onClose,
  file,
}: FilePreviewModalProps) {
  const isImage = file.type.startsWith("image/");

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileText className="h-16 w-16 text-red-500" />;
    } else if (fileType.includes("doc")) {
      return <FileText className="h-16 w-16 text-blue-500" />;
    } else if (fileType.includes("xls")) {
      return <FileSpreadsheet className="h-16 w-16 text-green-500" />;
    } else if (fileType.includes("ppt")) {
      return <Presentation className="h-16 w-16 text-orange-500" />;
    }
    return <File className="h-16 w-16 text-gray-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-4xl", isImage && "p-0")}>
        <DialogTitle className="hidden">File Preview</DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        {isImage ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "1000px",
              margin: "auto",
            }}
          >
            <Image
              src={file.url} // URL of the image from Supabase Storage
              alt={file.name} // Alt text for accessibility
              layout="responsive" // Ensures the image maintains its aspect ratio
              width={16} // Placeholder value (will be overridden by intrinsic size)
              height={9} // Placeholder value (will be overridden by intrinsic size)
              priority // Optional: Set to true if the image is above the fold
            />
            <a
              href={file.url}
              download
              className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 p-6">
            {getFileIcon(file.type)}
            <p className="text-lg font-medium">{file.name}</p>
            <a
              href={file.url}
              download
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download File
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
