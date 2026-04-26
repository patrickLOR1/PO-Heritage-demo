"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { SITE_CONFIG } from "@/lib/site-config";
import { ArrowRight, ChevronRight, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import dynamic from "next/dynamic";
import MiniGame from "./MiniGame";

const SplineScene = dynamic(() => import("@splinetool/react-spline"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />
});

export default function Hero() {
  const { hero } = SITE_CONFIG;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-[60px]"
    >
      {/* ── Background layers (Basement Style) ───────────────── */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-screen pointer-events-none filter grayscale"
          src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-connection-with-nodes-and-lines-27361-large.mp4" 
        />
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen hidden sm:block">
          <SplineScene scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
        </div>
        <div className="absolute inset-0 noise-global opacity-50" />
      </div>

      {/* Radial center glow */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[900px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.06) 40%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-7"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[12px] font-medium tracking-wide text-blue-300 border border-blue-500/25 bg-blue-500/[0.08]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400" />
              </span>
              {hero.badge}
            </span>
          </motion.div>

          {/* Headline — Basement-grade monumental typography */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-[62px] sm:text-[90px] lg:text-[130px] font-black leading-[0.85] tracking-tighter text-transparent bg-clip-text bg-white mb-8 uppercase"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.8)" }}
          >
            {hero.headline}
            <br />
            <span
              className="text-gradient italic"
            >
              {hero.headlineAccent}
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
            className="text-[17px] leading-[1.65] text-slate-400 max-w-[600px] mb-9"
          >
            {hero.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="flex flex-col sm:flex-row items-center gap-3 mb-16"
          >
            <Link
              href="#pricing"
              id="hero-cta-primary"
              className="group btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[14px] font-semibold transition-all duration-200"
            >
              {hero.cta.primary}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
            <a
              href="#chat"
              id="hero-cta-demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-medium text-slate-300 hover:text-white border border-white/[0.09] hover:border-white/[0.18] bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-200 cursor-pointer"
            >
              <span className="w-4 h-4 rounded-full border border-blue-500/60 bg-blue-500/15 flex items-center justify-center">
                <span className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[5px] border-l-blue-400 ml-0.5" />
              </span>
              {hero.cta.secondary}
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {hero.stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                {i > 0 && (
                  <div className="hidden sm:block w-px h-4 bg-white/10" />
                )}
                <div className="text-right">
                  <span className="text-[22px] font-bold text-white tracking-tight">{stat.value}</span>
                  <span className="ml-2 text-[12px] text-slate-500">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Hero Product Mockup ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-16 lg:mt-24 max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-6 relative z-20"
        >
          {/* Left Column: Game & Code */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* The Basement Studio Vibe Mini-Game */}
            <MiniGame />

            {/* Interactive Code Snippet */}
            <div className="w-full rounded-[20px] bg-[#0A0A0A] border border-white/10 p-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] font-mono text-zinc-500">api/prospector.ts</span>
            </div>
            <pre className="text-[11px] sm:text-xs font-mono text-zinc-300 overflow-x-auto">
              <code className="block">
<span className="text-pink-500">const</span> <span className="text-blue-400">agent</span> = <span className="text-pink-500">new</span> <span className="text-emerald-400">PoHeritageAgent</span>({`{`}<br/>
&nbsp;&nbsp;mode: <span className="text-orange-400">'autonomous'</span>,<br/>
&nbsp;&nbsp;target: <span className="text-orange-400">'CEOs in Real Estate'</span><br/>
{`}`});<br/>
<br/>
<span className="text-zinc-500">// Start the scraping engine</span><br/>
<span className="text-pink-500">await</span> agent.<span className="text-blue-400">deploy</span>();<br/>
<br/>
agent.<span className="text-blue-400">on</span>(<span className="text-orange-400">'lead_found'</span>, (<span className="text-blue-400">lead</span>) =&gt; {`{`}<br/>
&nbsp;&nbsp;<span className="text-emerald-400">Pipeline</span>.<span className="text-blue-400">insert</span>(lead);<br/>
&nbsp;&nbsp;<span className="text-emerald-400">Notification</span>.<span className="text-blue-400">send</span>(<span className="text-orange-400">'Found new Match!'</span>);<br/>
{"});"}
              </code>
            </pre>
          </div>
          </div>

          {/* Actual UI Mockup */}
          <div className="w-full lg:w-2/3">
            <HeroMockup />
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
    </section>
  );
}

function HeroMockup() {
  const leads = SITE_CONFIG.dashboard.sampleLeads;

  return (
    <div className="relative">
      {/* Outer glow */}
      <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-blue-500/20 via-blue-500/10 to-transparent blur-2xl" />

      {/* Main window chrome */}
      <div className="relative rounded-[20px] border border-white/[0.065] bg-[#060d1a] shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden noise">
        {/* Window titlebar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.055] bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] opacity-80" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="h-5 px-4 rounded-md bg-[#0a1628] border border-white/[0.055] flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="text-[11px] text-slate-500 font-mono">poheritage.mx/dashboard</span>
            </div>
          </div>
        </div>

        {/* App layout */}
        <div className="flex h-[380px] lg:h-[420px]">
          {/* Sidebar */}
          <div className="w-[200px] shrink-0 border-r border-white/[0.055] bg-[#04090f] p-3 flex flex-col gap-1 hidden md:flex">
            <div className="px-2 pt-1 pb-2.5">
              <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-[0.12em]">Workspace</p>
            </div>
            {[
              { label: "Pipeline", active: true, dot: "bg-blue-500" },
              { label: "Prospectos", active: false, dot: "bg-slate-700" },
              { label: "Conversaciones", active: false, dot: "bg-slate-700" },
              { label: "Analytics", active: false, dot: "bg-slate-700" },
              { label: "ARIA Chat", active: false, dot: "bg-green-500/70" },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-default ${
                  item.active
                    ? "bg-blue-500/[0.12] border border-blue-500/20"
                    : "hover:bg-white/[0.04]"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                <span className={`text-[12px] font-medium ${item.active ? "text-blue-300" : "text-slate-500"}`}>
                  {item.label}
                </span>
              </div>
            ))}
            <div className="mt-auto">
              <div className="flex items-center gap-2 px-2 pb-1">
                <img 
                  src={SITE_CONFIG.company.logo} 
                  alt={SITE_CONFIG.company.name} 
                  className="h-8 w-auto object-contain brightness-125 contrast-125 mix-blend-screen"
                />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Top bar */}
            <div className="px-5 py-3 border-b border-white/[0.055] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500 font-mono">po-heritage / pipeline</p>
                <p className="text-[15px] font-semibold text-white mt-0.5">Pipeline Activo</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/[0.2]">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-[11px] text-green-400 font-medium">+24% mes</span>
                </div>
                <div className="h-7 px-3 rounded-lg bg-blue-600/[0.15] border border-blue-500/[0.2] flex items-center">
                  <span className="text-[11px] font-semibold text-blue-300">$478,000 MXN</span>
                </div>
              </div>
            </div>

            {/* Leads table */}
            <div className="flex-1 overflow-hidden px-5 py-3">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 mb-2 pb-2 border-b border-white/[0.045]">
                {["Prospecto", "Valor", "Score"].map(h => (
                  <span key={h} className="text-[10px] font-semibold text-slate-600 uppercase tracking-[0.1em]">{h}</span>
                ))}
              </div>

              {/* Rows */}
              <div className="space-y-1">
                {leads.map((lead, i) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.09, duration: 0.35 }}
                    className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-2.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-default"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                        {lead.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-white truncate">{lead.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{lead.company}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300 tabular-nums">
                      ${(lead.value / 1000).toFixed(0)}K
                    </span>
                    <div
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor:
                          lead.score >= 90 ? "rgba(34,197,94,0.13)"
                          : lead.score >= 70 ? "rgba(59,130,246,0.13)"
                          : "rgba(234,179,8,0.13)",
                        color:
                          lead.score >= 90 ? "#4ade80"
                          : lead.score >= 70 ? "#60a5fa"
                          : "#fbbf24",
                      }}
                    >
                      {lead.score}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ARIA status bar */}
            <div className="px-5 py-2.5 border-t border-white/[0.055] flex items-center gap-2">
              <div className="relative flex h-1.5 w-1.5">
                <span className="ping-slow absolute h-full w-full rounded-full bg-blue-400 opacity-60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-blue-400" />
              </div>
              <span className="text-[11px] text-slate-500 font-mono">ARIA · procesando 3 prospectos nuevos</span>
              <span className="ml-auto text-[11px] text-blue-400 font-mono">48ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating KPI card */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="float absolute -right-4 lg:-right-10 top-12 w-[170px] rounded-2xl border border-white/[0.07] bg-[#060d1a]/90 backdrop-blur-xl p-4 shadow-2xl"
      >
        <div className="text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider">Tasa de cierre</div>
        <div className="text-[26px] font-bold text-white leading-none">34.2%</div>
        <div className="flex items-center gap-1 mt-2">
          <div className="p-0.5 rounded bg-green-500/15">
            <TrendingUp className="w-2.5 h-2.5 text-green-400" />
          </div>
          <span className="text-[10px] text-green-400 font-medium">+5.1% vs mes ant.</span>
        </div>
      </motion.div>

      {/* Floating notification */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="float-delay absolute -left-4 lg:-left-10 bottom-16 w-[190px] rounded-2xl border border-white/[0.07] bg-[#060d1a]/90 backdrop-blur-xl p-4 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center">
            <Zap className="w-3 h-3 text-green-400" />
          </div>
          <span className="text-[11px] font-semibold text-white">Nuevo cierre</span>
        </div>
        <p className="text-[11px] text-slate-400">Diego R. — $210,000 MXN</p>
        <p className="text-[10px] text-green-400 mt-1.5">Hace 2 min · via ARIA</p>
      </motion.div>
    </div>
  );
}
