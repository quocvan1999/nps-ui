import { Button } from "antd";
import { twMerge } from "tailwind-merge";
import type { NpsButtonProps } from "./types";

export function NpsButton({ className, rounded, ...props }: NpsButtonProps) {
  const roundedClass =
    rounded === "full"
      ? "!rounded-full"
      : rounded === "lg"
        ? "!rounded-lg"
        : rounded === "md"
          ? "!rounded-md"
          : undefined;

  return <Button className={twMerge(roundedClass, className)} {...props} />;
}
