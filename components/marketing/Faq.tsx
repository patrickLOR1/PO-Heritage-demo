"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12px] font-semibold uppercase tracking-[0.14em] text-blue-400/80 mb-4"
          >
            Preguntas Frecuentes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="text-[36px] lg:text-[42px] font-bold tracking-[-0.025em] leading-[1.1] text-white"
          >
            Despeja tus <span className="text-gradient">dudas.</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {(SITE_CONFIG as any).faq.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "rounded-2xl border transition-all duration-300 overflow-hidden",
                openIndex === i 
                  ? "bg-white/[0.03] border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]" 
                  : "bg-white/[0.01] border-white/[0.06] hover:border-white/[0.12]"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <span className={cn(
                  "text-[15px] font-semibold transition-colors duration-200",
                  openIndex === i ? "text-blue-400" : "text-slate-200 group-hover:text-white"
                )}>
                  {item.q}
                </span>
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300",
                  openIndex === i ? "bg-blue-600 text-white rotate-0" : "bg-white/[0.05] text-slate-500 rotate-90"
                )}>
                  {openIndex === i ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <div className="px-6 pb-6 text-[14px] text-slate-400 leading-relaxed border-t border-white/[0.04] pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
