"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; }

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "¡Hola! Soy ARIA, tu SDR inteligente de PO Heritage. 👋 ¿Tu empresa ya tiene un proceso de ventas estructurado, o estás empezando a escalar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      if (data.content) setMessages((p) => [...p, { role: "assistant", content: data.content }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Hubo un error. Intenta de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="chat" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left: copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[12px] font-semibold uppercase tracking-[0.14em] text-blue-400/80 mb-4"
            >
              IA en vivo · Groq + Llama 3
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
              className="text-[38px] lg:text-[46px] font-bold tracking-[-0.025em] leading-[1.1] text-white mb-5"
            >
              Habla con ARIA,{" "}
              <br className="hidden lg:block" />
              <span className="text-gradient">tu SDR de IA.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[15px] text-slate-400 leading-relaxed mb-8 max-w-md"
            >
              ARIA califica prospectos, responde objeciones y agenda demos — todo en tiempo real. Pruébala ahora mismo.
            </motion.p>

            {/* Stats */}
            {[
              { n: "<50ms", label: "Tiempo de respuesta promedio" },
              { n: "24/7", label: "Disponibilidad sin downtime" },
              { n: "Llama 3 70B", label: "Modelo de lenguaje base" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 + i * 0.07 }}
                className="flex items-center gap-4 py-3 border-b border-white/[0.05] last:border-0"
              >
                <span className="text-[18px] font-bold text-white min-w-[80px]">{s.n}</span>
                <span className="text-[13px] text-slate-500">{s.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Right: chat widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.55 }}
          >
            <div className="rounded-2xl border border-white/[0.065] bg-[#060d1a] overflow-hidden shadow-2xl">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.055]">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#060d1a]" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-white leading-tight">ARIA</p>
                  <p className="text-[11px] text-slate-500">SDR Inteligente · En línea</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0a1628] border border-white/[0.06]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[11px] font-mono text-slate-400">&lt;50ms</span>
                </div>
              </div>

              {/* Messages */}
              <div className="h-72 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "assistant" ? "bg-gradient-to-br from-blue-500 to-blue-700" : "bg-white/10"}`}>
                        {msg.role === "assistant"
                          ? <Bot className="w-3 h-3 text-white" />
                          : <User className="w-3 h-3 text-slate-300" />
                        }
                      </div>
                      <div
                        className={`max-w-[82%] px-3.5 py-2.5 text-[13px] leading-[1.55] rounded-xl ${
                          msg.role === "assistant"
                            ? "bg-white/[0.05] border border-white/[0.07] text-slate-200 rounded-tl-sm"
                            : "bg-blue-600 text-white rounded-tr-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="px-3.5 py-3 rounded-xl rounded-tl-sm bg-white/[0.05] border border-white/[0.07]">
                      <div className="flex gap-1.5 items-center">
                        {[0, 1, 2].map((j) => (
                          <motion.div
                            key={j}
                            className="w-1.5 h-1.5 rounded-full bg-blue-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: j * 0.18 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-3.5 py-3 border-t border-white/[0.055] flex gap-2">
                <input
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder-slate-600 outline-none focus:border-blue-500/40 focus:bg-blue-500/[0.03] transition-all"
                />
                <button
                  id="chat-send"
                  onClick={send}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0 shadow-[0_0_16px_rgba(59,130,246,0.35)]"
                >
                  {isLoading
                    ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    : <Send className="w-3.5 h-3.5 text-white" />
                  }
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
