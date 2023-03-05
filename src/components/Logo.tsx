import { HTMLProps } from "react";
import logo from "../assets/logo.svg";

export function Logo({ className, ...props }: HTMLProps<HTMLImageElement>) {
  return (
    <img
      {...props}
      className={`w-full h-full ${className}`}
      src={logo}
      alt="Dual Finance"
    />
  );
}
