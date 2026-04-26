"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { nav } = SITE_CONFIG;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#030712]/80 backdrop-blur-2xl border-b border-white/[0.055] shadow-[0_1px_0_0_rgba(59,130,246,0.08)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-[60px] flex items-center gap-8">
        {/* Logo */}
        <Link href="/" id="nav-logo" className="flex items-center gap-2.5 shrink-0 group">
          <img 
            src={SITE_CONFIG.company.logo} 
            alt={SITE_CONFIG.company.name} 
            className="h-9 w-auto object-contain brightness-125 contrast-125 mix-blend-screen"
          />
        </Link>

        {/* Divider */}
        <div className="hidden md:block w-px h-4 bg-white/10" />

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {nav.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              id={`nav-${link.label.toLowerCase().replace(" ", "-")}`}
              className="px-3.5 py-1.5 text-[13px] font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <Link
            href="/dashboard"
            id="nav-login"
            className="px-3.5 py-1.5 text-[13px] font-medium text-slate-400 hover:text-white transition-colors duration-150 rounded-lg hover:bg-white/[0.05]"
          >
            Iniciar sesión
          </Link>
          <Link
            href="#pricing"
            id="nav-cta"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all duration-200 shadow-[0_0_0_1px_rgba(59,130,246,0.5),0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_0_1px_rgba(96,165,250,0.6),0_0_28px_rgba(59,130,246,0.35)]"
          >
            {nav.cta}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          id="nav-mobile-toggle"
          aria-label="Abrir menú"
          className="md:hidden ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="md:hidden border-t border-white/[0.055] bg-[#030712]/95 backdrop-blur-2xl"
          >
            <div className="max-w-7xl mx-auto px-5 py-4 space-y-1">
              {nav.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block py-2.5 px-3 text-[14px] text-slate-300 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/[0.06]">
                <Link
                  href="#pricing"
                  className="block mt-2 py-2.5 px-3 text-center rounded-lg bg-blue-600 text-white text-[14px] font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  {nav.cta}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LogoMark() {
  return (
    <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_14px_rgba(59,130,246,0.45)]">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1L12.5 4V10L7 13L1.5 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="7" cy="7" r="2" fill="white" opacity="0.9"/>
      </svg>
    </div>
  );
}
