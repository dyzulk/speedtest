import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSpeed(bps: number): { value: string; unit: string } {
  // Library Cloudflare Speedtest mengembalikan nilai dalam bits per second (bps),
  // BUKAN Bytes per second. Sehingga kita tidak perlu mengalikannya dengan 8 lagi.
  // Cukup dibagi 1 juta untuk mendapatkan Megabits per second (Mbps).
  const mbps = bps / 1000000;
  if (mbps >= 1000) {
    return { value: (mbps / 1000).toFixed(2), unit: 'Gbps' };
  }
  return { value: mbps >= 10 ? mbps.toFixed(1) : mbps.toFixed(2), unit: 'Mbps' };
}
