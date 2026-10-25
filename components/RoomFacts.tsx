// Shared by the room list cards and the room detail page; no hooks, so it works in both server and client components.
import { Car, Flame, Waves, Wifi, type LucideIcon } from "lucide-react";

// keys in room.facilities (JSON) → chip label and icon
export const AMENITIES: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "Swimming", label: "Swimming pool", icon: Waves },
  { key: "wifi",     label: "Wifi",          icon: Wifi },
  { key: "parking",  label: "Free parking",  icon: Car },
  { key: "bbq_area", label: "BBQ area",      icon: Flame },
  
];

export function Fact({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-green/70 font-semibold">
      <Icon className="h-4 w-4" /> {children}
    </li>
  );
}
