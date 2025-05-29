import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function showToast(title: string, message: string) {
  toast(title, {
    description: message,
    duration: 3000,
    position: "top-right",
  });
}