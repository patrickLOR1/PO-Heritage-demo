"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Settings, BarChart3, LayoutDashboard, LogOut, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddLead: () => void;
  onChangeTab: (tab: "pipeline" | "analytics" | "calendar" | "inbox" | "autoprospector" | "team" | "api" | "settings") => void;
}

export default function CommandPalette({ isOpen, setIsOpen, onAddLead, onChangeTab }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      // Close on Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
      
      if (!isOpen) return;

      const filteredActionsLength = actions.filter(a => a.title.toLowerCase().includes(search.toLowerCase())).length;
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredActionsLength);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredActionsLength) % filteredActionsLength);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const activeAction = actions.filter(a => a.title.toLowerCase().includes(search.toLowerCase()))[activeIndex];
        if (activeAction) {
          activeAction.perform();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen, search, activeIndex]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const actions = [
    {
      id: "add_lead",
      title: "Crear Nuevo Prospecto",
      icon: UserPlus,
      shortcut: "C",
      perform: () => {
        onAddLead();
        setIsOpen(false);
      }
    },
    {
      id: "go_pipeline",
      title: "Ir a Pipeline",
      icon: LayoutDashboard,
      shortcut: "P",
      perform: () => {
        onChangeTab("pipeline");
        setIsOpen(false);
      }
    },
    {
      id: "go_calendar",
      title: "Ir a Calendario",
      icon: LayoutDashboard,
      shortcut: "K",
      perform: () => {
        onChangeTab("calendar");
        setIsOpen(false);
      }
    },
    {
      id: "go_inbox",
      title: "Ir a Correos",
      icon: LayoutDashboard,
      shortcut: "I",
      perform: () => {
        onChangeTab("inbox");
        setIsOpen(false);
      }
    },
    {
      id: "go_analytics",
      title: "Ir a Analytics",
      icon: BarChart3,
      shortcut: "A",
      perform: () => {
        onChangeTab("analytics");
        setIsOpen(false);
      }
    },
    {
      id: "go_settings",
      title: "Configuración y Marca Blanca",
      icon: Settings,
      shortcut: "S",
      perform: () => {
        onChangeTab("settings");
        setIsOpen(false);
      }
    },
    {
      id: "logout",
      title: "Cerrar Sesión",
      icon: LogOut,
      shortcut: "Q",
      perform: () => {
        localStorage.removeItem("po_heritage_auth");
        router.push("/login");
      }
    }
  ];

  const filteredActions = actions.filter(action =>
    action.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl z-[201] overflow-hidden"
          >
            <div className="flex items-center px-4 border-b border-white/5">
              <Terminal className="w-5 h-5 text-zinc-500 mr-3" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="¿Qué necesitas hacer? (ej. 'Nuevo lead')"
                className="w-full bg-transparent border-none py-5 text-zinc-100 placeholder:text-zinc-500 focus:outline-none text-lg"
              />
              <div className="px-2 py-1 bg-[#141414] border border-white/5 rounded text-[10px] font-medium text-zinc-500 flex items-center gap-1">
                ESC
              </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto p-2">
              {filteredActions.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">Acciones Sugeridas</div>
                  {filteredActions.map((action, index) => (
                    <button
                      key={action.id}
                      onClick={action.perform}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn("w-full flex items-center justify-between p-3 rounded-xl transition-colors group text-left", 
                        activeIndex === index ? "bg-white/10" : "hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors border",
                          activeIndex === index ? "bg-white/10 border-white/20" : "bg-[#141414] border-white/5 group-hover:bg-white/10"
                        )}>
                          <action.icon className={cn("w-4 h-4 transition-colors", activeIndex === index ? "text-zinc-100" : "text-zinc-400 group-hover:text-zinc-100")} />
                        </div>
                        <span className={cn("text-sm font-medium transition-colors", activeIndex === index ? "text-white" : "text-zinc-300 group-hover:text-white")}>
                          {action.title}
                        </span>
                      </div>
                      {action.shortcut && (
                        <div className={cn("flex items-center gap-1 transition-opacity", activeIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                          <span className="px-2 py-1 bg-[#141414] border border-white/5 rounded text-[10px] text-zinc-500 font-medium">
                            ⌘ {action.shortcut}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <Search className="w-8 h-8 text-zinc-700 mb-3" />
                  <p className="text-zinc-400 text-sm font-medium">No se encontraron comandos para "{search}"</p>
                  <p className="text-zinc-600 text-xs mt-1">Prueba escribiendo "Nuevo" o "Configuración"</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/5 bg-[#111111] flex justify-between items-center text-[10px] text-zinc-500 font-medium">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↑</kbd><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↓</kbd> Navegar</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↵</kbd> Seleccionar</span>
              </div>
              <div>PO Heritage OS</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
