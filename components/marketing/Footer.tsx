"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";

export default function Footer() {
  const { footer, company } = SITE_CONFIG;

  return (
    <footer className="relative border-t border-white/[0.055] mt-4">
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img 
              src={company.logo} 
              alt={company.name} 
              className="h-7 w-auto object-contain brightness-125 contrast-125 opacity-80 hover:opacity-100 transition-opacity mix-blend-screen"
            />
            <span className="ml-2 text-[12px] text-slate-600 hidden lg:block">
              {footer.tagline}
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {footer.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[12px] text-slate-700">
            © {company.founded} {company.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
