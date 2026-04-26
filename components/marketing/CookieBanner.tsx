"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("po_heritage_cookies");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("po_heritage_cookies", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[400px] z-[300]"
        >
          <div className="glass p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-4 noise">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                  <path d="M8.5 8.5v.01" /><path d="M16 15.5v.01" /><path d="M12 12v.01" /><path d="M11 17v.01" /><path d="M7 14v.01" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-white">Privacidad y Cookies</p>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              Utilizamos cookies para optimizar tu experiencia en PO Heritage. Al continuar, aceptas nuestra política de privacidad.
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={accept}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-bold transition-all active:scale-95"
              >
                Aceptar
              </button>
              <a href="/privacidad" className="flex-1 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-[13px] font-medium text-center transition-all">
                Ver más
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
