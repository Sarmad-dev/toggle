import React from "react";
import { Textarea } from "../ui/textarea";

const CustomTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => {
  return (
    <Textarea
      {...props}
      ref={ref}
      className="bg-white dark:bg-secondary min-h-[150px] border-gray-200 dark:border-gray-800 focus:border-indigo-500 dark:focus:border-indigo-500 shadow-sm resize-none"
    />
  );
});

CustomTextarea.displayName = "CustomTextarea";

export default CustomTextarea;
