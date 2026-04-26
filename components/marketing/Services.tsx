"use client";

import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/site-config";
import { Globe, Bot, BarChart3, Palette } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { Globe, Bot, BarChart3, Palette };

// Bento-style sizes for visual rhythm
const sizes = [
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-2",
];

export default function Services() {
  const { services } = SITE_CONFIG;

  return (
    <section id="services" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="max-w-xl mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12px] font-semibold uppercase tracking-[0.14em] text-blue-400/80 mb-4"
          >
            Nuestros Servicios
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="text-[38px] lg:text-[46px] font-bold tracking-[-0.025em] leading-[1.1] text-white"
          >
            Todo lo que tu negocio necesita,{" "}
            <span className="text-gradient">en un solo lugar.</span>
          </motion.h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Bot;
            const isWide = i === 0 || i === 3;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={`group relative rounded-2xl border border-white/[0.065] bg-[#060d1a] p-6 lg:p-7 overflow-hidden transition-all duration-300 hover:border-white/[0.11] hover:bg-[#070f1e] ${sizes[i]}`}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(59,130,246,0.07) 0%, transparent 70%)" }}
                />

                {/* Subtle top border shimmer on hover */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className={`flex ${isWide ? "lg:flex-row lg:gap-8 lg:items-start" : "flex-col"} gap-5`}>
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-blue-500/[0.1] border border-blue-500/[0.18] flex items-center justify-center shrink-0 group-hover:bg-blue-500/[0.15] group-hover:border-blue-500/[0.3] transition-all duration-300">
                    <Icon className="w-4.5 h-4.5 text-blue-400" />
                  </div>

                  <div>
                    <h3 className="text-[16px] font-semibold text-white mb-2 tracking-[-0.01em]">
                      {service.title}
                    </h3>
                    <p className="text-[14px] text-slate-500 leading-[1.6]">
                      {service.description}
                    </p>

                    {/* Wide card: extra visual element */}
                    {isWide && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {(i === 0
                          ? ["Next.js / React", "Diseño Responsive", "SEO Optimizado", "Velocidad 100/100"]
                          : ["CRM Personalizado", "Multi-Industria", "Métricas en Vivo", "App Móvil"]
                        ).map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-500 border border-white/[0.07] bg-white/[0.03]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
