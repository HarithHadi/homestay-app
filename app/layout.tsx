import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css"; // Import your global CSS
import FloatingNavbar from "@/components/floating-navbar";
import Navbar from "@/components/navbar";


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.className} h-full`} suppressHydrationWarning>
      <body className="bg-background h-full flex flex-col"> 
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 overflow-y-auto h-[calc(100vh-4rem)]">            
              {/* <FloatingNavbar /> */}
                {children}            
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
