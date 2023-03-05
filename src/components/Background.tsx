import { HTMLProps } from "react";

export function Background({
  children,
  className,
  ...props
}: HTMLProps<HTMLDivElement>) {
  return (
    <div {...props} className={`bg-gray-900 ${className}`}>
      {children}
    </div>
  );
}
