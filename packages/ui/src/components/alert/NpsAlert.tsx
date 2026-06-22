import { Alert } from "antd";
import { twMerge } from "tailwind-merge";
import type { NpsAlertProps } from "./types";

export function NpsAlert({ className, ...props }: NpsAlertProps) {
  return <Alert className={twMerge("", className)} {...props} />;
}
