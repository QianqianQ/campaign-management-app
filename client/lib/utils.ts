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

/* eslint-disable no-console */
// TODO: replace console with logger
interface Logger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

const createLogger = (): Logger => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    log: (...args: unknown[]) => {
      if (isDevelopment) console.log(...args);
    },
    error: (...args: unknown[]) => {
      if (isDevelopment) console.error(...args);
    },
    warn: (...args: unknown[]) => {
      if (isDevelopment) console.warn(...args);
    },
    info: (...args: unknown[]) => {
      if (isDevelopment) console.info(...args);
    },
    debug: (...args: unknown[]) => {
      if (isDevelopment) console.debug(...args);
    },
  };
};

export const logger = createLogger();