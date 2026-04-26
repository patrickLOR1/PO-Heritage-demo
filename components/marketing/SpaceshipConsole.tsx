"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, DollarSign, MessageSquare, HelpCircle, Power } from "lucide-react";
import Hero from "./Hero";
import Services from "./Services";
import PricingTable from "./PricingTable";
import AiChat from "./AiChat";
import Faq from "./Faq";
import { SITE_CONFIG } from "@/lib/site-config";
import Link from "next/link";
import { uiSound } from "@/lib/audio";
import CustomCursor from "./CustomCursor";
import dynamic from "next/dynamic";

// Lazy load the heavy 3D scene to prevent UI blocking and lag
const SplineScene = dynamic(() => import("@splinetool/react-spline"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />
});

type TabId = "home" | "services" | "pricing" | "chat" | "faq";

export default function SpaceshipConsole() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [isBooting, setIsBooting] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch devices (mobile/tablet) to disable custom cursor
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(touch);
    
    if (!touch) {
      document.body.style.cursor = "none";
    }
    return () => { document.body.style.cursor = "auto"; };
  }, []);

  const handleBoot = () => {
    if (!isTouchDevice) {
      uiSound.init();
      uiSound.boot();
    }
    setIsBooting(false);
  };

  const changeTab = (id: TabId) => {
    if (!isTouchDevice) uiSound.click();
    setActiveTab(id);
  };

  const tabs = [
    { id: "home", label: "Core", icon: Power, key: "1" },
    { id: "services", label: "Capab.", icon: Cpu, key: "2" },
    { id: "pricing", label: "Plans", icon: DollarSign, key: "3" },
    { id: "chat", label: "ARIA", icon: MessageSquare, key: "4" },
    { id: "faq", label: "Data", icon: HelpCircle, key: "5" },
  ] as const;

  useEffect(() => {
    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBooting) return;
      const tab = tabs.find(t => t.key === e.key);
      if (tab) {
        changeTab(tab.id as TabId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBooting]);

  if (isBooting) {
    return (
      <div className="h-[100dvh] w-screen bg-[#030712] flex items-center justify-center font-mono text-blue-500 text-sm p-5 cursor-default md:cursor-none">
        {!isTouchDevice && <CustomCursor />}
        <div className="max-w-xl w-full text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-lg md:text-xl px-4"
          >
            &gt; PO HERITAGE OS OFFLINE
          </motion.div>
          
          <button 
            onClick={handleBoot}
            onMouseEnter={() => { if (!isTouchDevice) { uiSound.init(); uiSound.hover(); } }}
            className="px-6 py-3 md:px-8 bg-blue-600/20 border border-blue-500 hover:bg-blue-600 hover:text-white text-blue-400 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] uppercase tracking-widest font-bold text-xs md:text-base w-full md:w-auto"
          >
            INITIATE BOOT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-screen bg-[#030712] text-slate-300 overflow-hidden flex flex-col font-sans cursor-default md:cursor-none">
      {!isTouchDevice && <CustomCursor />}
      
      {/* 3D Background - Spline (Hidden on very small screens for performance) */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen hidden sm:block">
        <SplineScene scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
      </div>

      <div className="fixed inset-0 pointer-events-none noise-global z-0" />
      <div className="fixed inset-0 pointer-events-none border-[4px] md:border-[8px] border-[#0a1628]/80 z-50 md:rounded-xl" />

      {/* Top HUD Bar */}
      <header className="h-auto min-h-[60px] py-2 md:py-0 border-b border-blue-500/20 bg-[#060d1a]/80 backdrop-blur-md z-40 flex flex-col md:flex-row items-center justify-between px-2 md:px-6 shrink-0 relative gap-2">
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <span className="font-mono text-[10px] md:text-xs text-blue-400 tracking-[0.1em] md:tracking-[0.2em] uppercase truncate">
              {SITE_CONFIG.company.name} // SYS
            </span>
          </div>
          <Link
            href="/dashboard"
            className="md:hidden flex items-center gap-1 text-[10px] font-mono text-slate-400"
          >
            <Terminal className="w-3 h-3" />
            [CTRL]
          </Link>
        </div>
        
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-blue-500/10 w-full overflow-x-auto scrollbar-hide justify-between md:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => changeTab(tab.id as TabId)}
              onMouseEnter={() => !isTouchDevice && uiSound.hover()}
              className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 py-1.5 md:px-4 rounded-md text-[9px] md:text-xs font-mono tracking-wider transition-all duration-300 flex-1 md:flex-none relative group ${
                activeTab === tab.id
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="truncate">{tab.label}</span>
              <span className="hidden md:block absolute -top-2 -right-2 bg-[#030712] border border-blue-500/20 text-[8px] px-1 rounded text-blue-500/50 group-hover:text-blue-400 transition-colors">
                {tab.key}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            [ACCESS_DASHBOARD]
          </Link>
          <div className="text-xs font-mono text-slate-600">v2.0.4</div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
        <div className="min-h-full flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex-1 w-full"
            >
              {/* Content Injection */}
              <div className="max-w-[1400px] mx-auto w-full pb-20">
                {activeTab === "home" && <Hero />}
                {activeTab === "services" && <Services />}
                {activeTab === "pricing" && <PricingTable />}
                {activeTab === "chat" && <AiChat />}
                {activeTab === "faq" && <Faq />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-[30px] border-t border-blue-500/20 bg-[#060d1a]/90 z-40 flex items-center px-6 justify-between text-[10px] font-mono text-slate-500 shrink-0">
        <div className="flex items-center gap-4">
          <span>STATUS: ONLINE</span>
          <span className="text-green-500 hidden md:inline">LATENCY: 14ms</span>
          <span className="text-blue-500/70 animate-pulse hidden sm:inline">&gt; SELECT MODULE OR PRESS 1-5</span>
        </div>
        <div>
          ENCRYPTION: AES-256
        </div>
      </footer>
    </div>
  );
}
