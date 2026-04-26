"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, ArrowRight, Loader2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export default function PricingTable() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { pricing } = SITE_CONFIG;

  const handleCheckout = (plan: any) => {
    // Como aún no hay SAT/Stripe, redirigimos todo el flujo de ventas a WhatsApp
    const period = isAnnual ? "Anual" : "Mensual";
    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
    
    // Formatear mensaje para que el cliente solo tenga que enviarlo
    const message = `Hola ${SITE_CONFIG.company.name}, me interesa contratar el *Plan ${plan.name}* (${period}) que vi en su sitio web.\n\nValor: $${price.toLocaleString()} MXN/mes.\n\n¿Podrían compartirme los datos de pago para comenzar?`;
    
    const whatsappUrl = `https://wa.me/${SITE_CONFIG.company.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="pricing" className="py-28 lg:py-36 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(59,130,246,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12px] font-semibold uppercase tracking-[0.14em] text-blue-400/80 mb-4"
          >
            Planes & Precios
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="text-[38px] lg:text-[52px] font-bold tracking-[-0.025em] leading-[1.08] text-white mb-4"
          >
            Inversión que se{" "}
            <span className="text-gradient">paga sola.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[16px] text-slate-400 leading-relaxed"
          >
            Sin contratos anuales forzados. Sin costos ocultos. Solo resultados medibles desde el día uno.
          </motion.p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="inline-flex items-center gap-4 mt-8 p-1 rounded-full border border-white/[0.07] bg-white/[0.03]"
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-250",
                !isAnnual
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              Mensual
            </button>
            <button
              id="billing-toggle"
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-250 flex items-center gap-2",
                isAnnual
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              Anual
              <span className="px-1.5 py-0.5 rounded-md bg-green-500/15 border border-green-500/20 text-[10px] font-bold text-green-400">
                -{pricing.annualDiscount}%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-5 max-w-5xl mx-auto items-start">
          {pricing.plans.map((plan, i) => {
            // @ts-ignore
            const highlighted = "highlighted" in plan && plan.highlighted;
            const currentPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={cn(
                  "relative flex flex-col rounded-2xl transition-all duration-300",
                  highlighted
                    ? "p-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent"
                    : "border border-white/[0.065] bg-[#060d1a]"
                )}
              >
                {/* Inner wrapper for highlighted card */}
                <div
                  className={cn(
                    "flex flex-col flex-1 rounded-[14px] p-6",
                    highlighted ? "bg-[#060d1a]" : ""
                  )}
                >
                  {/* Highlight shimmer */}
                  {highlighted && (
                    <div className="absolute inset-x-0 top-0 h-px shimmer rounded-t-2xl" />
                  )}

                  {/* Badge */}
                  {plan.badge && (
                    <div className="mb-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                          highlighted
                            ? "bg-blue-500/15 border-blue-500/30 text-blue-300"
                            : "bg-white/[0.07] border-white/10 text-slate-400"
                        )}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan name & description */}
                  <h3 className="text-[18px] font-semibold text-white mb-1.5">
                    {plan.name}
                  </h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={isAnnual ? "a" : "m"}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                          className="text-[36px] font-bold text-white tracking-tight tabular-nums"
                        >
                          ${currentPrice.toLocaleString("es-MX")}
                        </motion.span>
                      </AnimatePresence>
                      <div className="text-[13px] text-slate-500 leading-tight">
                        MXN<br />
                        <span className="text-[12px]">/mes</span>
                      </div>
                    </div>
                    <AnimatePresence>
                      {isAnnual && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[12px] text-green-400 mt-1.5 overflow-hidden"
                        >
                          Ahorras ${((plan.monthlyPrice - plan.annualPrice) * 12).toLocaleString("es-MX")} MXN/año
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* CTA */}
                  <button
                    id={`pricing-cta-${plan.id}`}
                    onClick={() => handleCheckout(plan)}
                    className={cn(
                      "w-full py-2.5 px-5 rounded-xl text-[13px] font-semibold mb-6 transition-all duration-200 flex items-center justify-center gap-1.5 group",
                      highlighted
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.4),0_0_24px_rgba(59,130,246,0.28)] hover:shadow-[0_0_0_1px_rgba(96,165,250,0.5),0_0_36px_rgba(59,130,246,0.40)]"
                        : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/[0.16]"
                    )}
                  >
                    {plan.cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Divider */}
                  <div className="h-px bg-white/[0.055] mb-6" />

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.text}
                        className="flex items-start gap-2.5"
                      >
                        <div
                          className={cn(
                            "mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center",
                            feature.included
                              ? "bg-blue-500/15 border border-blue-500/25"
                              : "bg-white/[0.04] border border-white/[0.06]"
                          )}
                        >
                          {feature.included ? (
                            <Check className="w-2 h-2 text-blue-400" strokeWidth={3} />
                          ) : (
                            <Minus className="w-2 h-2 text-slate-700" strokeWidth={3} />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[13px] leading-snug",
                            feature.included ? "text-slate-300" : "text-slate-600"
                          )}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-[12px] text-slate-600 mt-10"
        >
          Todos los precios en MXN + IVA · Prueba gratuita de 14 días en planes Core y Tactical · Cancela cuando quieras
        </motion.p>
      </div>
    </section>
  );
}
