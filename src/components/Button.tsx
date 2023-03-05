import { HTMLProps } from "react";

export function Button({
  children,
  className,
  type = "button",
  ...props
}: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full bg-[#2C7A5E] p-2 rounded ${className}`}
    >
      {children}
    </button>
  );
}
