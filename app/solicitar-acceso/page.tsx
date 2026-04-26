"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_CONFIG } from "@/lib/site-config";
import { 
  Shield, CheckCircle2, ArrowRight, User, 
  Building2, Mail, Phone, Zap, ChevronRight 
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export default function RequestAccessPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#030712] pt-32 pb-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-[1000px] mx-auto px-5 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Content Side */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                  <Zap className="w-3 h-3" />
                  Acceso Prioritario
                </div>
                <h1 className="text-[48px] font-bold text-white tracking-tight leading-[1.1] mb-6">
                  Únete a la nueva era de la <span className="text-gradient">Inteligencia Comercial</span>.
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed mb-8">
                  Estamos habilitando el acceso a PO Heritage de manera gradual para garantizar la máxima calidad de servicio para cada cliente.
                </p>

                <ul className="space-y-4">
                  {[
                    "Implementación personalizada en 48h",
                    "Entrenamiento de IA con tus propios datos",
                    "Soporte prioritario 24/7",
                    "Dashboards personalizados por sector"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Form Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="glass p-8 lg:p-10 rounded-[32px] border border-white/10 shadow-2xl relative noise">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-2">Solicitar Acceso</h2>
                      <p className="text-sm text-slate-500 mb-8">Completa el formulario y un consultor se pondrá en contacto contigo.</p>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                              required
                              type="text" 
                              placeholder="Ej. Juan Pérez"
                              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Empresa</label>
                          <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                              required
                              type="text" 
                              placeholder="Nombre de tu empresa"
                              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Corporativo</label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                              <input 
                                required
                                type="email" 
                                placeholder="juan@empresa.com"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Teléfono</label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                              <input 
                                required
                                type="tel" 
                                placeholder="+52..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group active:scale-95"
                          >
                            {loading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                Enviar Solicitud
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-center text-slate-600 mt-4 px-4">
                          Al enviar, aceptas nuestros <Link href="/terminos" className="underline">Términos de Servicio</Link> y <Link href="/privacidad" className="underline">Política de Privacidad</Link>.
                        </p>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10"
                    >
                      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4">¡Solicitud Enviada!</h2>
                      <p className="text-slate-400 mb-8 leading-relaxed">
                        Gracias por tu interés en PO Heritage. Nuestro equipo analizará tu perfil y se pondrá en contacto contigo en las próximas 24 horas.
                      </p>
                      <Link 
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                      >
                        Volver al Inicio
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
