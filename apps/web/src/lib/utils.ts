import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes with clsx logic.
 * Essential for modern component development.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
