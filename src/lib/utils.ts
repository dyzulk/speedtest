import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSpeed(bytesPerSecond: number): { value: string; unit: string } {
  const mbps = (bytesPerSecond * 8) / 1000000;
  if (mbps >= 1000) {
    return { value: (mbps / 1000).toFixed(2), unit: 'Gbps' };
  }
  return { value: mbps >= 10 ? mbps.toFixed(1) : mbps.toFixed(2), unit: 'Mbps' };
}
