'use client'

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileNav({
  links,
  authSlot,
}: {
  links: { label: string; href: string }[];
  authSlot: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger toggle */}
      <button
        className="flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="fixed top-16 left-0 right-0 bg-[#FDF4AF] shadow-md border-t border-black/10 flex flex-col items-stretch py-4 z-50">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-5 py-2.5 text-base font-medium text-black hover:bg-black/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-5 pt-3 mt-2 border-t border-black/10 flex items-center gap-3">
            {authSlot}
          </div>
        </div>
      )}
    </div>
  );
}