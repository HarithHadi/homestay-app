// /rooms/page.tsx
"use client";

import { Suspense } from "react";
import RoomsPageClient from "./rooms-client";

export default function RoomsPage() {
  return (
    <Suspense fallback={<p>Loading search params...</p>}>
      <RoomsPageClient />
    </Suspense>
  );
}
