import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type UnitType = 'Kbps' | 'Mbps' | 'KBps' | 'MBps';

export function formatSpeed(bps: number, unit: UnitType = 'Mbps'): { value: string; unit: string } {
  let val = 0;
  
  if (unit === 'Kbps') {
    val = bps / 1000;
  } else if (unit === 'Mbps') {
    val = bps / 1_000_000;
  } else if (unit === 'KBps') {
    val = (bps / 8) / 1000;
  } else if (unit === 'MBps') {
    val = (bps / 8) / 1_000_000;
  }

  if (val >= 1000 && (unit === 'Mbps' || unit === 'MBps')) {
    return { value: (val / 1000).toFixed(2), unit: unit === 'Mbps' ? 'Gbps' : 'GBps' };
  }
  
  return { value: val >= 10 ? val.toFixed(1) : val.toFixed(2), unit };
}
