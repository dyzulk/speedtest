import React from 'react';
import { APP_CONFIG } from '@/types';

export const FooterSection: React.FC = () => {
  return (
    <footer className="w-full max-w-7xl mx-auto mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
      <p>{APP_CONFIG.name} — {APP_CONFIG.subtitle}</p>
      <p>{APP_CONFIG.techStack}</p>
    </footer>
  );
};

export default FooterSection;
