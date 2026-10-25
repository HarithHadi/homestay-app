"use client";

import { Button } from "@/components/ui/button";

// The browser's print dialog doubles as "save as PDF", so no PDF library is needed.
export default function PrintButton() {
  return (
    <Button onClick={() => window.print()} className="print:hidden w-full py-6">
      Print / save as PDF
    </Button>
  );
}
