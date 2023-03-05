import { HTMLAttributes, PropsWithChildren } from "react";

export function CardLight({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      {...props}
      className={`bg-[hsla(0,0%,100%,.1)] border-[1px] border-[hsla(0,0%,100%,.2)] py-2.5 px-4 rounded ${className}`}
    >
      {children}
    </div>
  );
}
