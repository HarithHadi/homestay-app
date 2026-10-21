"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FADE_MS = 500; // keep in sync with duration-500 below

// Shows ?error= once, then drops it from the URL so a refresh doesn't bring it back.
export function FlashError({ message, ms = 4000 }: { message: string; ms?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setFading(false);
    const fade = setTimeout(() => setFading(true), ms - FADE_MS);
    const clear = setTimeout(() => router.replace(pathname, { scroll: false }), ms);
    return () => {
      clearTimeout(fade);
      clearTimeout(clear);
    };
  }, [message, ms, pathname, router]);

  return (
    <Card
      className={cn(
        "border-red-500 shadow-none transition-opacity duration-500 motion-reduce:transition-none",
        fading && "opacity-0"
      )}
    >
      <CardContent className="p-4 text-sm text-red-600">{message}</CardContent>
    </Card>
  );
}
