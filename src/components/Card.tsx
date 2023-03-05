import { HTMLAttributes, PropsWithChildren } from "react";

export function Card({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      {...props}
      className={`w-full p-4 rounded bg-black border-2 border-gray-500 ${className}`}
    >
      {children}
    </div>
  );
}
