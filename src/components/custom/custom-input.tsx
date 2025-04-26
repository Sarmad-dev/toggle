import React from "react";
import { Input } from "../ui/input";

const CustomInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <Input
      {...props}
      ref={ref}
      className="h-[50px] bg-white dark:bg-secondary border-gray-200 dark:border-gray-800 focus:border-indigo-500 dark:focus:border-indigo-500 shadow-sm"
    />
  );
});

CustomInput.displayName = "CustomInput";

export default CustomInput;
