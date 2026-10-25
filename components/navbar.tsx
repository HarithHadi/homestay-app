import Link from "next/link";
import HeaderAuth from "@/components/header-auth";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { displayFont } from "@/lib/font";
import MobileNav from "@/components/mobile-nav";

const navLinks = [
  { label: "Rooms", href: "/rooms" },
  { label: "My Bookings", href: "/bookings" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const authSlot = !hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />;

  return (
    <nav className="print:hidden w-full flex flex-col items-center border-b-2 border-brand-black bg-[#FDF4AF] z-50 relative">
      <div className="w-full max-w-5xl flex justify-between items-center px-5 h-16 ">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className={`${displayFont.className} text-3xl md:text-4xl text-orange-500`}>
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