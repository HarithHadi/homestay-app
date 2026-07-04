import Link from "next/link";
import HeaderAuth from "@/components/header-auth";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Fraunces } from "next/font/google";
import MobileNav from "@/components/mobile-nav";

const navLinks = [
  { label: "Rooms", href: "/rooms" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
});

export default function Navbar() {
  const authSlot = !hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />;

  return (
    <nav className="w-full flex flex-col items-center border-b border-black bg-[#FDF4AF] z-50 relative">
      <div className="w-full max-w-5xl flex justify-between items-center px-5 h-16 ">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className={`${fraunces.className} text-2xl md:text-3xl font-bold text-orange-500`}>
            Swit60
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-foreground/70">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {authSlot}
        </div>

        {/* Mobile: hamburger + dropdown */}
        <MobileNav authSlot={authSlot} />
      </div>
    </nav>
  );
}