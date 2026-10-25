// lib/font.ts
import { Gochi_Hand, Patrick_Hand } from "next/font/google";

// Headings / logo (apply via displayFont.className)
export const displayFont = Gochi_Hand({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Body text, set on <html> in app/layout.tsx
export const bodyFont = Patrick_Hand({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
