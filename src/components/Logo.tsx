import { HTMLProps } from "react";
import logo from "../assets/builderz-logo-transparent.png";

export function Logo({ className, ...props }: HTMLProps<HTMLImageElement>) {
  return (
    <img
      {...props}
      className={`w-full h-full ${className}`}
      src={logo}
      alt="Builderz"
    />
  );
}
