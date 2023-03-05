import { HTMLProps, InputHTMLAttributes, MouseEventHandler } from "react";
import { CardLight } from "./CardLight";

type InputProps = {
  onChange: InputHTMLAttributes<HTMLInputElement>["onChange"];
  onMaxClick?: MouseEventHandler<HTMLDivElement>;
  token?: { symbol: string; image: string };
} & Omit<HTMLProps<HTMLInputElement>, "onChange">;

export function TokenInput({
  className,
  type,
  value,
  onChange,
  step,
  min,
  max,
  placeholder,
  onMaxClick,
  token,
  ...props
}: InputProps) {
  return (
    <CardLight {...props}>
      <div className="flex items-center gap-2">
        {token && (
          <img
            src={token.image}
            alt={`${token.symbol} icon`}
            className="w-6 h-6 rounded-full"
          />
        )}
        <input
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          step={step}
          min={min}
          max={max}
          className="flex-1 min-w-0 h-7 bg-transparent border-0 text-lg font-bold text-[rgba(#ffffff, 0.5)]"
        />
        {onMaxClick && (
          <div
            role="button"
            onClick={onMaxClick}
            className="w-9 text-sm rounded-lg bg-[hsla(0,0%,100%,.1)] text-[hsla(0,0%,100%,.7)]] pl-[0.5px]"
          >
            max
          </div>
        )}
      </div>
    </CardLight>
  );
}
