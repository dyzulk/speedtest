import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-24 h-8 bg-muted/40 animate-pulse rounded-md border border-border/50" />
    );
  }

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const getIcon = () => {
    if (theme === 'light') return <FiSun className="w-3.5 h-3.5 text-amber-500" />;
    if (theme === 'dark') return <FiMoon className="w-3.5 h-3.5 text-indigo-400" />;
    return <FiMonitor className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  const getLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'System';
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={cycleTheme}
      className="h-8 px-2.5 rounded-md border-border/70 bg-card/60 hover:bg-accent text-xs font-mono gap-2 transition-all"
      title={`Current Theme: ${getLabel()} (Click to change)`}
    >
      {getIcon()}
      <span className="capitalize text-[11px] text-foreground font-medium">{getLabel()}</span>
    </Button>
  );
};
