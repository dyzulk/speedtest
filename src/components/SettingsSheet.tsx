import React from 'react';
import { Settings } from 'lucide-react';
import { useSettings, type UnitType, type ScaleType } from '@/contexts/SettingsContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SettingsSheet: React.FC = () => {
  const { unit, scale, setUnit, setScale } = useSettings();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:shadow-md transition-all">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Test Settings</SheetTitle>
          <SheetDescription>
            Configure your speedtest preferences. Changes are saved automatically.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-8 px-8 py-6">
          <div className="flex flex-col gap-2.5">
            <h4 className="text-sm font-semibold text-foreground">Speed Unit</h4>
            <Select value={unit} onValueChange={(v) => setUnit(v as UnitType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kbps">Kbps (Kilobits)</SelectItem>
                <SelectItem value="Mbps">Mbps (Megabits)</SelectItem>
                <SelectItem value="KBps">KBps (KiloBytes)</SelectItem>
                <SelectItem value="MBps">MBps (MegaBytes)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose how bandwidth speeds are displayed.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="text-sm font-semibold text-foreground">Speedometer Scale</h4>
            <Select value={scale.toString()} onValueChange={(v) => setScale(Number(v) as ScaleType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select scale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100 (Standard)</SelectItem>
                <SelectItem value="500">500 (Fast)</SelectItem>
                <SelectItem value="1000">1000 (Gigabit)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Sets the maximum value on the visual speedometer dial.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
