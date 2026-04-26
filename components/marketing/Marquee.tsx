"use client";

import { motion } from "framer-motion";

export default function Marquee() {
  const items = [
    "PO HERITAGE",
    "INTELIGENCIA COMERCIAL",
    "ARIA AI",
    "REVENUE ELITE",
    "AUTOMATIZACIÓN",
    "SDR 24/7",
    "CIERRE DE TRATOS",
    "PIPELINE MILITAR"
  ];

  return (
    <div className="relative py-8 bg-blue-600 overflow-hidden border-y border-white/20 select-none">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="text-[42px] lg:text-[72px] font-black text-white px-8 text-monument italic">
              {item}
            </span>
            <div className="w-4 h-4 lg:w-6 lg:h-6 bg-white rotate-45" />
          </div>
        ))}
      </div>
    </div>
  );
}
