export interface AppConfig {
  name: string;
  subtitle: string;
  badge: string;
  techStack: string;
}

export const APP_CONFIG: AppConfig = {
  name: import.meta.env.VITE_APP_TITLE || 'React Vite Speedtest',
  subtitle: 'Powered by Cloudflare Edge Measurement API',
  badge: 'PRO',
  techStack: 'Built with React, Vite, Tailwind CSS v4 & Shadcn UI (Sera Preset)',
};
