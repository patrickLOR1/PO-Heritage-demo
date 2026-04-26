"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_CONFIG } from "@/lib/site-config";
import { supabase } from "@/lib/supabase";
import { 
  TrendingUp, Users, DollarSign, Activity, ArrowUpRight, 
  ChevronRight, Plus, X, MessageSquare, Calendar, 
  Mail, Phone, ShieldCheck, Zap, Bell, LayoutDashboard, 
  BarChart3, Settings, LogOut, Download, User, Building,
  Lock, Save, Trash2, Camera, Loader2, UserPlus, FileText,
  Upload, BrainCircuit, Sparkles, Search, Filter, Edit2, Terminal, Package, Clock, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const stageColors: Record<string, string> = {
  nuevo: "#3B82F6",
  contactado: "#8B5CF6",
  calificado: "#F59E0B",
  propuesta: "#10B981",
  cerrado: "#22C55E",
};

interface Notification {
  id: string;
  text: string;
  type: "success" | "info" | "error";
}

import CommandPalette from "./CommandPalette";

type Tab = "pipeline" | "analytics" | "calendar" | "inbox" | "autoprospector" | "inventory" | "team" | "api" | "settings";

export default function LeadsDashboard() {
  const { dashboard, company } = SITE_CONFIG;
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("pipeline");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCreateLeadModal, setShowCreateLeadModal] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [redAlert, setRedAlert] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setLogoClicks(prev => prev + 1);
    if (logoClicks >= 4) {
      setRedAlert(!redAlert);
      setLogoClicks(0);
      if (!redAlert) notify("RED ALERT ENGAGED. SHIELDS UP.", "error");
      else notify("SYSTEMS NOMINAL", "success");
    }
  };
  const [scrapedLeads, setScrapedLeads] = useState<any[]>([]);
  const [prospectorForm, setProspectorForm] = useState({
    industry: "Bienes Raíces",
    role: "CEO, Fundador",
    location: "Ciudad de México"
  });

  // Edit Lead State
  const [editForm, setEditForm] = useState({
    name: "",
    company: "",
    value: 0
  });

  // Inbox State
  const [emails, setEmails] = useState<{ id: string; sender: string; email: string; subject: string; time: string; unread: boolean; body: string; avatar: string; }[]>([]);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Create Lead State
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    company: "",
    value: "",
    source: "Manual"
  });

  // Team State
  const [team, setTeam] = useState([
    { id: 1, name: "Admin Heritage", email: "admin@poheritage.com", role: "Owner", status: "online", avatar: "AH" },
    { id: 2, name: "Carlos SDR", email: "carlos@poheritage.com", role: "SDR Senior", status: "away", avatar: "CS" },
    { id: 3, name: "Elena Ventas", email: "elena@poheritage.com", role: "Account Executive", status: "offline", avatar: "EV" },
  ]);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireForm, setHireForm] = useState({ name: "", email: "", role: "SDR" });

  const handleHire = async () => {
    if (!hireForm.name || !hireForm.email) {
      notify("Faltan datos del tripulante", "error");
      return;
    }

    const newMember = {
      name: hireForm.name,
      email: hireForm.email,
      role: hireForm.role,
      status: "online",
      avatar: hireForm.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase(),
      ...(orgId ? { org_id: orgId } : {})
    };

    try {
      if (orgId) {
        const { data, error } = await supabase.from('team_members').insert([newMember]).select();
        if (!error && data && data.length > 0) {
          setTeam([...team, data[0]]);
        } else {
          // RLS or DB error — fallback to local state
          setTeam([...team, { id: Math.random().toString(36).substr(2, 9), ...newMember }]);
        }
      } else {
        // No org_id resolved — save locally only
        setTeam([...team, { id: Math.random().toString(36).substr(2, 9), ...newMember }]);
      }
      
      setShowHireModal(false);
      setHireForm({ name: "", email: "", role: "SDR" });
      notify(`Tripulante ${hireForm.name} contratado exitosamente.`, "success");
    } catch (err: any) {
      // On any error, still add locally so UI isn't broken
      setTeam([...team, { id: Math.random().toString(36).substr(2, 9), ...newMember }]);
      setShowHireModal(false);
      setHireForm({ name: "", email: "", role: "SDR" });
      notify(`${hireForm.name} agregado (modo local).`, "info");
    }
  };

  // AI Knowledge State
  const [kb] = useState([
    { id: 1, name: "Dossier_Ventas_2024.pdf", size: "2.4 MB", status: "trained" },
    { id: 2, name: "Lista_Precios_Q2.xlsx", size: "1.1 MB", status: "trained" },
  ]);

  // Settings State
  const [profile, setProfile] = useState({
    name: "Admin Heritage",
    email: "admin@poheritage.com",
    role: "Administrador Senior",
    industry: "B2B" // Default to B2B SaaS terminology
  });

  // Dynamic Label Generator based on Industry
  const getLabels = () => {
    switch(profile.industry) {
      case "Gym":
        return { 
          lead: "Miembro", leads: "Miembros", pipeline: "Suscripciones", 
          newLead: "Nuevo Miembro", sdr: "Recepción IA", inventory: "Clases/Equipos",
          metrics: { kpi4: "Membresías Activas", eff1: "Asistencia Promedio", eff2: "Retención de Miembros", eff3: "Ocupación de Clases" }
        };
      case "Barberia":
        return { 
          lead: "Cita", leads: "Citas", pipeline: "Reservas", 
          newLead: "Nueva Cita", sdr: "Asistente IA", inventory: "Productos/Servicios",
          metrics: { kpi4: "Citas Pendientes", eff1: "Tasa de Asistencia", eff2: "Venta de Productos", eff3: "Ocupación de Agenda" }
        };
      case "Retail":
        return { 
          lead: "Cliente", leads: "Clientes", pipeline: "Pedidos", 
          newLead: "Nuevo Pedido", sdr: "Vendedor IA", inventory: "Inventario",
          metrics: { kpi4: "Carritos Abandonados", eff1: "Tasa de Conversión", eff2: "Retención de Clientes", eff3: "Rotación de Inventario" }
        };
      case "Inmobiliaria":
        return { 
          lead: "Comprador", leads: "Compradores", pipeline: "Propiedades", 
          newLead: "Nuevo Prospecto", sdr: "Agente IA", inventory: "Catálogo Inmobiliario",
          metrics: { kpi4: "Comisiones Pendientes", eff1: "Cierre de Ventas", eff2: "Visitas Agendadas", eff3: "Inventario Activo" }
        };
      case "Clinica":
        return { 
          lead: "Paciente", leads: "Pacientes", pipeline: "Consultas", 
          newLead: "Nuevo Paciente", sdr: "Asistente Médico", inventory: "Suministros/Tratamientos",
          metrics: { kpi4: "Consultas de Hoy", eff1: "Asistencia de Pacientes", eff2: "Tratamientos Completados", eff3: "Ocupación de Consultorios" }
        };
      case "Restaurante":
        return { 
          lead: "Mesa", leads: "Reservas", pipeline: "Comandas", 
          newLead: "Nueva Reserva", sdr: "Host IA", inventory: "Insumos/Menú",
          metrics: { kpi4: "Ticket Promedio", eff1: "Satisfacción del Cliente", eff2: "Mesas Atendidas", eff3: "Tiempo Promedio por Mesa" }
        };
      case "Taller":
        return { 
          lead: "Vehículo", leads: "Vehículos", pipeline: "Reparaciones", 
          newLead: "Nuevo Ingreso", sdr: "Asistente de Taller", inventory: "Refacciones",
          metrics: { kpi4: "Autos en Taller", eff1: "Reparaciones a Tiempo", eff2: "Garantías Aplicadas", eff3: "Uso de Refacciones" }
        };
      default:
        return { 
          lead: "Prospecto", leads: "Prospectos", pipeline: "Cargo Bay", 
          newLead: "Nuevo Prospecto", sdr: "SDR IA", inventory: "Catálogo",
          metrics: { kpi4: "Cuentas por Cobrar", eff1: "Tasa de Respuesta", eff2: "Calificación Exitosa", eff3: "Agenda Automática" }
        };
    }
  };
  
  const labels = getLabels();

  // Auth Guard & Initial Fetch — resolves org_id for multi-tenant isolation
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const localAuth = localStorage.getItem("po_heritage_auth");
        if (!localAuth) {
          router.push("/login");
          return;
        }
      }
      
      setIsAuth(true);

      // Resolve org_id from team_members using the user's auth id
      let resolvedOrgId: string | null = null;
      if (session?.user) {
        const { data: memberData } = await supabase
          .from('team_members')
          .select('org_id, name, role')
          .eq('user_id', session.user.id)
          .single();

        if (memberData?.org_id) {
          resolvedOrgId = memberData.org_id;
          setOrgId(resolvedOrgId);
          setProfile(prev => ({
            ...prev,
            email: session.user.email as string,
            name: memberData.name || prev.name,
            role: memberData.role || prev.role
          }));
        }
      }
      
      fetchData(resolvedOrgId);
    };
    
    checkAuth();
  }, [router]);

  const fetchData = async (currentOrgId?: string | null) => {
    const oid = currentOrgId ?? orgId;
    try {
      setLoading(true);
      
      // Fetch Leads — filtered by org_id
      let leadsQuery = supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (oid) leadsQuery = leadsQuery.eq('org_id', oid);
      const { data: leadsData, error: leadsError } = await leadsQuery;

      if (!leadsError && leadsData) {
        setLeads(leadsData);
      } else {
        setLeads([]);
      }

      // Fetch Team Members — filtered by org_id
      let teamQuery = supabase.from('team_members').select('*').order('created_at', { ascending: true });
      if (oid) teamQuery = teamQuery.eq('org_id', oid);
      const { data: teamData, error: teamError } = await teamQuery;

      if (!teamError && teamData && teamData.length > 0) {
        setTeam(teamData);
      }

      // Fetch Emails — filtered by org_id
      let emailsQuery = supabase.from('emails').select('*').order('created_at', { ascending: false });
      if (oid) emailsQuery = emailsQuery.eq('org_id', oid);
      const { data: emailsData, error: emailsError } = await emailsQuery;

      if (!emailsError && emailsData && emailsData.length > 0) {
        setEmails(emailsData);
      }

    } catch (err) {
      console.error(err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedLead = useMemo(() => 
    leads.find(l => l.id === selectedLeadId), 
  [leads, selectedLeadId]);

  // Sync edit form when lead selected
  useEffect(() => {
    if (selectedLead) {
      setEditForm({
        name: selectedLead.name,
        company: selectedLead.company,
        value: selectedLead.value
      });
      setIsEditing(false);
    }
  }, [selectedLead]);

  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  // Stats Aggregation
  const stats = useMemo(() => {
    const totalValue = leads.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const activeLeads = leads.filter(l => l.stage !== "cerrado").length;
    const closedLeads = leads.filter(l => l.stage === "cerrado").length;
    const conversionRate = leads.length > 0 ? (closedLeads / leads.length) * 100 : 0;
    const chartValues = leads.slice(0, 7).map(l => (l.value / 1000) % 100).reverse();

    return {
      cards: [
        { id: "pipeline-value", label: "Valor Pipeline", value: `$${(totalValue / 1000).toFixed(1)}k`, suffix: "MXN", trend: "+24%", icon: DollarSign, trendColor: "text-emerald-400" },
        { id: "active-leads",   label: `${labels.leads} Activos`, value: activeLeads.toString(), trend: `${leads.length} total`, icon: Users, trendColor: "text-emerald-400" },
        { id: "conversion",     label: "Conversión", value: `${conversionRate.toFixed(1)}%`, trend: `${closedLeads} cerrados`, icon: TrendingUp, trendColor: "text-emerald-400" },
        { id: "ai-calls",       label: "Interacciones",  value: leads.length.toString(), trend: "en tiempo real", icon: Activity, trendColor: "text-zinc-400" },
      ],
      chartData: chartValues.length > 0 ? chartValues : [30, 45, 32, 60, 48, 70, 85]
    };
  }, [leads]);

  const notify = (text: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ id, text, type }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const addRandomLead = async () => {
    const names = ["Gabriel Luna", "Sofia Ruiz", "Marcos Paz", "Elena Sol", "Julian Rios"];
    const companiesList = ["TechNova", "Global Logistics", "Vesta Realty", "Nube Systems", "Astra Corp"];
    
    const newLead = {
      name: names[Math.floor(Math.random() * names.length)],
      company: companiesList[Math.floor(Math.random() * companiesList.length)],
      stage: "nuevo",
      value: Math.floor(Math.random() * 100000) + 20000,
      score: Math.floor(Math.random() * 40) + 60,
      last_contact: "Recién llegado",
      avatar: names[Math.floor(Math.random() * names.length)].split(' ').map(n => n[0]).join(''),
      ...(orgId ? { org_id: orgId } : {})
    };

    const { data, error } = await supabase.from('leads').insert([newLead]).select();
    if (!error && data) {
      setLeads([data[0], ...leads]);
      notify(`Nuevo prospecto: ${newLead.name}`, "success");
    } else {
      setLeads([{...newLead, id: Math.random().toString()}, ...leads]);
      notify("Guardado localmente", "info");
    }
  };

  const updateLead = async () => {
    if (!selectedLeadId) return;
    const { error } = await supabase
      .from('leads')
      .update(editForm)
      .eq('id', selectedLeadId);

    if (!error) {
      setLeads(prev => prev.map(l => l.id === selectedLeadId ? { ...l, ...editForm } : l));
      notify("Actualizado", "success");
      setIsEditing(false);
    } else {
      setLeads(prev => prev.map(l => l.id === selectedLeadId ? { ...l, ...editForm } : l));
      notify("Actualizado localmente", "info");
      setIsEditing(false);
    }
  };

  const cycleStage = async (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const stages = dashboard.stages.map(s => s.id);
    const nextStage = stages[(stages.indexOf(lead.stage as any) + 1) % stages.length];

    const { error } = await supabase.from('leads').update({ stage: nextStage }).eq('id', leadId);
    if (!error) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: nextStage } : l));
      notify(`${lead.name} -> ${dashboard.stages.find(s => s.id === nextStage)?.label}`);
    } else {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: nextStage } : l));
      notify(`${lead.name} -> ${dashboard.stages.find(s => s.id === nextStage)?.label} (Local)`);
    }
  };

  const deleteLead = async (leadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const { error } = await supabase.from('leads').delete().eq('id', leadId);
    if (!error) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      notify(`Eliminado: ${lead.name}`, "error");
      if (selectedLeadId === leadId) setSelectedLeadId(null);
    } else {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      notify(`Eliminado localmente: ${lead.name}`, "info");
      if (selectedLeadId === leadId) setSelectedLeadId(null);
    }
  };

  const submitNewLead = async () => {
    if (!newLeadForm.name || !newLeadForm.company) {
      notify("Nombre y Empresa son requeridos", "error");
      return;
    }
    const newLead = {
      name: newLeadForm.name,
      company: newLeadForm.company,
      stage: "nuevo",
      value: Number(newLeadForm.value) || 0,
      score: Math.floor(Math.random() * 40) + 60,
      last_contact: "Recién añadido",
      avatar: newLeadForm.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      source: newLeadForm.source,
      ...(orgId ? { org_id: orgId } : {})
    };

    try {
      const { data, error } = await supabase.from('leads').insert([newLead]).select();
      if (!error && data) {
        setLeads([data[0], ...leads]);
      } else {
        setLeads([{...newLead, id: Math.random().toString(36).substr(2, 9)}, ...leads]);
      }
    } catch {
      setLeads([{...newLead, id: Math.random().toString(36).substr(2, 9)}, ...leads]);
    }

    notify(`${labels.lead} creado: ${newLead.name}`, "success");
    setShowCreateLeadModal(false);
    setNewLeadForm({ name: "", company: "", value: "", source: "Manual" });
  };

  const runAutoProspector = async () => {
    if (isScraping) {
      setIsScraping(false);
      return;
    }
    
    setIsScraping(true);
    setScrapedLeads([]);
    notify("Iniciando conexión con satélites de datos...", "info");
    
    try {
      const res = await fetch('/api/prospector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prospectorForm)
      });
      const data = await res.json();
      
      if (data.success && data.leads.length > 0) {
        setScrapedLeads(data.leads);
        notify(`¡Se encontraron ${data.leads.length} empresas reales!`, "success");
      } else {
        notify("No se encontraron resultados en esa zona.", "error");
      }
    } catch (err) {
      notify("Error al conectar con la API de datos pública.", "error");
    } finally {
      setIsScraping(false);
    }
  };

  if (!isAuth) return null;

  return (
    <div className={cn("min-h-screen bg-[#0A0A0A] flex overflow-hidden font-mono transition-colors duration-1000", redAlert ? "bg-red-950/20 text-red-500" : "text-zinc-300")}>
      {redAlert && <div className="fixed inset-0 bg-red-600/10 pointer-events-none z-50 animate-pulse border-8 border-red-600/30" />}
      
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] bg-[#111111] border-b border-white/5 flex items-center justify-between px-4 z-30 lg:hidden">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-400 hover:text-white transition-colors">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-xs font-bold tracking-widest uppercase text-zinc-100">PO Heritage</span>
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-300">
          {profile.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 left-0 bottom-0 w-[260px] border-r border-white/5 bg-[#111111] z-[41] flex flex-col p-6 lg:hidden">
              <div className="flex items-center gap-3 mb-10 px-2">
                <span className="font-bold tracking-widest uppercase text-xs text-zinc-100">PO Heritage</span>
              </div>
              <nav className="flex-1 space-y-1">
                {[
                  { id: "pipeline", label: labels.pipeline, icon: LayoutDashboard },
                  { id: "calendar", label: "AGENDA", icon: Calendar },
                  { id: "inbox", label: "MENSAJES", icon: Mail },
                  { id: "autoprospector", label: "PROSPECTOR", icon: BrainCircuit },
                  { id: "inventory", label: labels.inventory.toUpperCase(), icon: Package },
                  { id: "analytics", label: "MÉTRICAS", icon: BarChart3 },
                  { id: "team", label: "EQUIPO", icon: Users },
                  { id: "api", label: "INTEGRACIONES", icon: Terminal },
                  { id: "settings", label: "CONFIGURACIÓN", icon: Settings },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as Tab); setMobileMenuOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                      activeTab === item.id ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
              <button onClick={async () => { await supabase.auth.signOut(); localStorage.removeItem("po_heritage_auth"); router.push("/login"); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <LogOut className="w-4 h-4" /> Salir
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation (Desktop) */}
      <aside className={cn("w-[240px] border-r flex-col p-6 z-20 hidden lg:flex", redAlert ? "bg-red-950/40 border-red-500/30" : "border-white/5 bg-[#111111]")}>
        <div onClick={handleLogoClick} className="flex items-center gap-3 mb-10 px-2 group cursor-crosshair">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/10 group-hover:border-zinc-500 transition-all overflow-hidden p-1">
            <img 
              src="/brand/logo-new.png" 
              alt="PO Heritage Logo" 
              className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
            />
          </div>
          <span className={cn("font-bold tracking-widest uppercase transition-colors text-xs", redAlert ? "text-red-500" : "text-zinc-100")}>OS HERITAGE</span>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { id: "pipeline", label: labels.pipeline, icon: LayoutDashboard },
            { id: "calendar", label: "AGENDA", icon: Calendar },
            { id: "inbox", label: "MENSAJES", icon: Mail },
            { id: "autoprospector", label: "PROSPECTOR", icon: BrainCircuit },
            { id: "inventory", label: labels.inventory.toUpperCase(), icon: Package },
            { id: "analytics", label: "MÉTRICAS", icon: BarChart3 },
            { id: "team", label: "EQUIPO", icon: Users },
            { id: "api", label: "INTEGRACIONES", icon: Terminal },
            { id: "settings", label: "CONFIGURACIÓN", icon: Settings },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                activeTab === item.id 
                  ? redAlert ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white" 
                  : redAlert ? "text-red-700 hover:bg-red-500/10 hover:text-red-400" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-1">
          <div className="px-3 py-4 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-300">{profile.name.split(' ').map(n=>n[0]).join('').substring(0,2)}</div>
             <div className="min-w-0">
                <p className="text-[12px] font-medium text-zinc-100 truncate">{profile.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">SDR Plan</p>
             </div>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); localStorage.removeItem("po_heritage_auth"); router.push("/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto pt-[60px] lg:pt-0 relative bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8 lg:py-12">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h1 className={cn("text-2xl font-bold tracking-tight", redAlert ? "text-red-500" : "text-white")}>
                {activeTab === "pipeline" ? labels.pipeline :
                 activeTab === "inventory" ? labels.inventory :
                 activeTab === "calendar" ? "AGENDA" :
                 activeTab === "inbox" ? "MENSAJES" :
                 activeTab === "autoprospector" ? "PROSPECTOR" :
                 activeTab === "analytics" ? "MÉTRICAS" : 
                 activeTab === "api" ? "INTEGRACIONES" :
                 activeTab === "settings" ? "CONFIGURACIÓN" : "EQUIPO"}
              </h1>
              <div className="hidden sm:flex items-center gap-2">
                <span className={cn("flex w-2 h-2 rounded-full", redAlert ? "bg-red-500 animate-ping" : "bg-emerald-500")}></span>
                <span className={cn("text-xs font-mono", redAlert ? "text-red-400" : "text-zinc-400")}>
                  {redAlert ? "CRITICAL FAILURE" : "SYSTEMS NOMINAL"}
                </span>
              </div>
            </div>
            {activeTab === "pipeline" && (
              <div className="flex items-center gap-3">
                <div className="flex bg-[#141414] p-1 rounded-lg border border-white/5">
                  <button onClick={() => setViewMode("list")} className={cn("p-1.5 rounded-md transition-all", viewMode === "list" ? "bg-white/10 text-zinc-100" : "text-zinc-500 hover:text-zinc-300")}><FileText className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode("kanban")} className={cn("p-1.5 rounded-md transition-all", viewMode === "kanban" ? "bg-white/10 text-zinc-100" : "text-zinc-500 hover:text-zinc-300")}><LayoutDashboard className="w-4 h-4" /></button>
                </div>
                <div className="relative group hidden sm:block">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                   <input 
                      type="text" 
                      placeholder={`Buscar ${labels.lead.toLowerCase()}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-[#141414] border border-white/5 rounded-lg py-1.5 pl-9 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-white/20 transition-all w-[200px]"
                   />
                </div>
                <button onClick={() => notify("Filtros: Próximamente podrás filtrar por etapa, origen y valor.", "info")} className="px-3 py-1.5 rounded-lg bg-[#141414] border border-white/5 text-zinc-300 text-sm font-medium hover:bg-white/5 transition-all shadow-sm flex items-center gap-2">
                  <Filter className="w-4 h-4" /> <span className="hidden lg:inline">Filtros</span>
                </button>
                <button onClick={() => {
                  if (leads.length === 0) {
                    notify(`No hay ${labels.leads.toLowerCase()} para exportar`, "error");
                    return;
                  }
                  const headers = ["Nombre,Empresa,Etapa,Valor,Probabilidad,Contacto,Origen\n"];
                  const csv = leads.map(l => `${l.name},${l.company},${l.stage},${l.value},${l.score}%,${l.last_contact},${l.source}`).join("\n");
                  const blob = new Blob([headers + csv], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${labels.leads.toLowerCase()}_po_heritage_${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                  notify("Exportación completada", "success");
                }} className="px-3 py-1.5 rounded-lg bg-[#141414] border border-white/5 text-zinc-300 text-sm font-medium hover:bg-white/5 transition-all shadow-sm flex items-center gap-2">
                  <Download className="w-4 h-4" /> <span className="hidden lg:inline">Exportar CSV</span>
                </button>
                <button onClick={() => setShowCreateLeadModal(true)} className="px-4 py-1.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all shadow-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" /> {labels.newLead}
                </button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "pipeline" ? (
              <motion.div key="pipeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.cards.map(kpi => (
                    <div key={kpi.id} className="rounded-xl border border-white/5 bg-[#111111] p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-zinc-500">{kpi.label}</p>
                        <kpi.icon className="w-4 h-4 text-zinc-600" />
                      </div>
                      <p className="text-2xl font-semibold text-zinc-100 tabular-nums">{kpi.value}</p>
                    </div>
                  ))}
                </div>

                {/* Pipeline View (Kanban / List) */}
                {viewMode === "list" ? (
                  <div className="rounded-xl border border-white/5 bg-[#111111] overflow-hidden relative shadow-sm">
                    {loading && <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-10 flex items-center justify-center"><Loader2 className="w-8 h-8 text-zinc-500 animate-spin" /></div>}
                    <div className="grid grid-cols-[1fr_120px_100px_100px_120px_40px] gap-4 px-6 py-3 border-b border-white/5 bg-white/[0.02]">
                      {[labels.lead, "Valor", "Score IA", "Origen", "Etapa", ""].map(h => (
                        <span key={h} className="text-xs font-medium text-zinc-500">{h}</span>
                      ))}
                    </div>
                    <div className="divide-y divide-white/5 min-h-[400px]">
                      {filteredLeads.map((lead, idx) => (
                        <motion.div key={lead.id || idx} layoutId={lead.id} onClick={() => setSelectedLeadId(lead.id)}
                          className={cn("grid grid-cols-[1fr_120px_100px_100px_120px_40px] gap-4 items-center px-6 py-3 hover:bg-white/[0.03] transition-all cursor-pointer group",
                            selectedLeadId === lead.id && "bg-white/5"
                          )}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs font-medium border border-white/5">{lead.avatar || "P"}</div>
                            <div>
                              <p className="text-sm font-medium text-zinc-200">{lead.name}</p>
                              <p className="text-xs text-zinc-500">{lead.company}</p>
                            </div>
                          </div>
                          <span className="text-sm text-zinc-300 tabular-nums">${Number(lead.value).toLocaleString()}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400">{lead.score}%</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-white/5 uppercase">
                              {idx % 3 === 0 ? "API" : idx % 2 === 0 ? "WEBHOOK" : "MANUAL"}
                            </span>
                          </div>
                          <button onClick={(e) => cycleStage(lead.id, e)} className="px-2 py-1 rounded-md text-[10px] font-medium border truncate"
                            style={{ backgroundColor: `${stageColors[lead.stage]}10`, color: stageColors[lead.stage], borderColor: `${stageColors[lead.stage]}20` }}>
                            {dashboard.stages.find(s => s.id === lead.stage)?.label}
                          </button>
                          <button onClick={(e) => deleteLead(lead.id, e)} className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                        </motion.div>
                      ))}
                      {filteredLeads.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 text-sm">
                           <Search className="w-8 h-8 text-zinc-700 mb-3" />
                           <p>No hay resultados</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide min-h-[500px]">
                    {dashboard.stages.map(stage => (
                      <div key={stage.id} className="min-w-[280px] w-[280px] flex flex-col bg-[#111111] border border-white/5 rounded-xl p-3 shadow-sm h-fit">
                        <div className="flex items-center justify-between mb-4 px-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stageColors[stage.id] }} />
                            <h3 className="text-sm font-medium text-zinc-300">{stage.label}</h3>
                          </div>
                          <span className="text-xs font-medium text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full border border-white/5">
                            {filteredLeads.filter(l => l.stage === stage.id).length}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {filteredLeads.filter(l => l.stage === stage.id).map((lead) => (
                            <motion.div 
                              layoutId={`kanban-${lead.id}`}
                              key={lead.id}
                              onClick={() => setSelectedLeadId(lead.id)}
                              className="bg-[#18181B] border border-white/5 rounded-lg p-3 hover:border-white/20 transition-all cursor-pointer shadow-sm group"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="text-sm font-medium text-zinc-200">{lead.name}</p>
                                  <p className="text-xs text-zinc-500">{lead.company}</p>
                                </div>
                                <button onClick={(e) => deleteLead(lead.id, e)} className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3.5 h-3.5" /></button>
                              </div>
                              <div className="flex items-center justify-between mt-4">
                                <span className="text-xs font-medium text-zinc-400">${Number(lead.value).toLocaleString()}</span>
                                <button onClick={(e) => cycleStage(lead.id, e)} className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-zinc-400 transition-colors">
                                  Mover &rarr;
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

            ) : activeTab === "calendar" ? (
              <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-4">
                     <button className="p-2 bg-[#141414] border border-white/5 rounded-lg hover:bg-white/5">&lt;</button>
                     <h2 className="text-lg font-medium text-zinc-100">Septiembre 2026</h2>
                     <button className="p-2 bg-[#141414] border border-white/5 rounded-lg hover:bg-white/5">&gt;</button>
                   </div>
                   <button onClick={() => setShowScheduleModal(true)} className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-all flex items-center gap-2">
                     <Plus className="w-4 h-4" /> Agendar
                   </button>
                </div>
                <div className="grid grid-cols-7 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(d => (
                    <div key={d} className="bg-[#0A0A0A] p-3 text-xs font-medium text-zinc-500 text-center">{d}</div>
                  ))}
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="bg-[#111111] min-h-[100px] p-2 hover:bg-[#141414] transition-colors border-t border-white/5">
                      <span className="text-xs font-medium text-zinc-600">{i + 1 > 30 ? (i + 1) - 30 : i + 1}</span>
                      {i === 14 && (
                        <div className="mt-1 p-1.5 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] text-blue-400 font-medium">10:00 - Demo Vesta Realty</div>
                      )}
                      {i === 16 && (
                        <div className="mt-1 p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-400 font-medium">14:30 - Cierre TechNova</div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

            ) : activeTab === "inbox" ? (
              <motion.div key="inbox" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex h-[75vh] border border-white/5 rounded-2xl overflow-hidden bg-[#111111] shadow-sm">
                <div className="w-1/3 border-r border-white/5 flex flex-col bg-[#0A0A0A]">
                  <div className="p-4 border-b border-white/5">
                    <input type="text" placeholder="Buscar correos..." className="w-full bg-[#141414] border border-white/5 rounded-lg py-2 px-3 text-sm text-zinc-100 focus:outline-none focus:border-white/20" />
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                    {emails.map((email) => (
                      <div key={email.id} onClick={() => {
                        setSelectedEmailId(email.id);
                        if (email.unread) {
                          setEmails(emails.map(e => e.id === email.id ? { ...e, unread: false } : e));
                        }
                      }} className={cn("p-4 cursor-pointer transition-colors", email.id === selectedEmailId ? "bg-white/[0.05]" : email.unread ? "bg-white/[0.02] hover:bg-white/[0.04]" : "hover:bg-white/[0.02]")}>
                        <div className="flex justify-between items-start mb-1">
                          <span className={cn("text-sm font-medium", email.unread ? "text-zinc-100" : "text-zinc-400")}>{email.sender}</span>
                          <span className="text-[10px] text-zinc-600">{email.time}</span>
                        </div>
                        <p className={cn("text-xs line-clamp-1", email.unread ? "text-zinc-300 font-medium" : "text-zinc-500")}>{email.subject}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  {(() => {
                    const selected = emails.find(e => e.id === selectedEmailId);
                    if (!selected) return (
                      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                        <Mail className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm font-medium text-zinc-400">Bandeja de Entrada Vacía</p>
                        <p className="text-xs text-zinc-600 mt-2">No hay mensajes seleccionados o recibidos</p>
                      </div>
                    );
                    return (
                      <>
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-medium text-zinc-100 mb-2">{selected.subject}</h2>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                               <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300">{selected.avatar}</div>
                               <span>{selected.sender} &lt;{selected.email}&gt;</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => {
                               setEmails(emails.filter(e => e.id !== selected.id));
                               setSelectedEmailId(null);
                               notify("Correo eliminado", "error");
                             }} className="p-2 bg-[#141414] border border-white/5 rounded-lg hover:bg-white/5 text-zinc-400"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="p-6 text-sm text-zinc-300 leading-relaxed flex-1 whitespace-pre-wrap">
                          {selected.body}
                        </div>
                        <div className="p-4 border-t border-white/5 bg-[#0A0A0A]">
                          <div className="bg-[#141414] border border-white/5 rounded-xl p-3 focus-within:border-white/20 transition-colors">
                            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Escribe tu respuesta..." className="w-full bg-transparent border-none text-sm text-zinc-100 resize-none focus:outline-none" rows={3} />
                            <div className="flex justify-between items-center mt-2">
                              <button onClick={() => { setReplyText(""); notify("Borrador descartado", "info"); }} className="text-zinc-500 hover:text-zinc-300"><LogOut className="w-4 h-4" /></button>
                              <button onClick={() => {
                                if (!replyText) return;
                                notify("Correo enviado exitosamente", "success");
                                setReplyText("");
                              }} className="px-4 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-zinc-200 transition-colors">Enviar</button>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>

            ) : activeTab === "autoprospector" ? (
              <motion.div key="autoprospector" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl space-y-6">
                <div className="rounded-2xl border border-white/5 bg-[#111111] overflow-hidden shadow-sm">
                   <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-[#141414]">
                     <h2 className="text-base font-medium text-zinc-100 flex items-center gap-2">
                       <BrainCircuit className={cn("w-4 h-4", isScraping ? "text-blue-500 animate-pulse" : "text-zinc-400")} /> 
                       Motor de Búsqueda Autónoma
                     </h2>
                     {isScraping ? (
                       <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-medium rounded border border-blue-500/20 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Escaneando LinkedIn & Google...
                       </span>
                     ) : (
                       <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-medium rounded border border-white/5">En Espera</span>
                     )}
                   </div>
                   <div className="p-6">
                     <p className="text-sm text-zinc-400 mb-6">Configura a tu cliente ideal (ICP) y el Agente IA buscará leads por ti automáticamente, encontrando sus correos y teléfonos.</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="space-y-2"><label className="text-xs font-medium text-zinc-500 ml-1">Industria</label><input type="text" value={prospectorForm.industry} onChange={(e) => setProspectorForm({...prospectorForm, industry: e.target.value})} placeholder="Ej. Real Estate, SaaS..." className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-100 focus:outline-none focus:border-white/20" /></div>
                        <div className="space-y-2"><label className="text-xs font-medium text-zinc-500 ml-1">Cargo (Rol)</label><input type="text" value={prospectorForm.role} onChange={(e) => setProspectorForm({...prospectorForm, role: e.target.value})} placeholder="Ej. CEO, Director..." className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-100 focus:outline-none focus:border-white/20" /></div>
                        <div className="space-y-2"><label className="text-xs font-medium text-zinc-500 ml-1">Ubicación</label><input type="text" value={prospectorForm.location} onChange={(e) => setProspectorForm({...prospectorForm, location: e.target.value})} placeholder="Ej. México, España..." className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-100 focus:outline-none focus:border-white/20" /></div>
                     </div>
                     <div className="flex justify-end pt-2 border-t border-white/5">
                        <button onClick={runAutoProspector} className={cn("px-6 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2", isScraping ? "bg-[#141414] border border-white/10 text-zinc-300 hover:bg-white/5" : "bg-white text-black hover:bg-zinc-200")}>
                           {isScraping ? "Detener Búsqueda" : "Activar Búsqueda Autónoma"}
                        </button>
                     </div>
                   </div>
                </div>

                {(isScraping || scrapedLeads.length > 0) && (
                  <div className="rounded-2xl border border-white/5 bg-[#111111] overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-white/5 bg-[#141414]">
                      <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> Prospectos Encontrados Recientemente</h3>
                    </div>
                    {isScraping && scrapedLeads.length === 0 ? (
                      <div className="p-10 flex flex-col items-center justify-center text-zinc-500 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-sm font-medium">Consultando bases de datos globales...</p>
                      </div>
                    ) : (
                    <div className="divide-y divide-white/5">
                      {scrapedLeads.map((lead, i) => (
                        <div key={i} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-white/[0.02] transition-colors">
                          <div className="flex gap-4 items-center">
                             <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300 border border-white/5">{lead.name.split(' ').map((n: string)=>n[0]).join('')}</div>
                             <div>
                                <div className="flex items-center gap-2"><h4 className="text-sm font-medium text-zinc-100">{lead.name}</h4><span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-medium rounded border border-emerald-500/20">{lead.match} Match</span></div>
                                <p className="text-xs text-zinc-500">{lead.company} • {lead.displayPhone}</p>
                             </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                             <button onClick={() => window.open(`tel:${lead.phone}`, '_self')} className="px-3 py-1.5 bg-[#141414] border border-white/5 rounded-lg text-xs font-medium text-zinc-300 hover:bg-white/5 transition-all flex items-center gap-1.5"><Phone className="w-3 h-3" /> Llamar</button>
                             <button onClick={() => window.open(`https://wa.me/${lead.phone.replace('+', '')}?text=Hola%20${lead.name.split(' ')[0]},%20te%20contacto%20desde%20PO%20Heritage.`, '_blank')} className="px-3 py-1.5 bg-[#141414] border border-white/5 rounded-lg text-xs font-medium text-zinc-300 hover:bg-white/5 transition-all flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> WhatsApp</button>
                             <button onClick={() => {
                               const newScrapedLead = {
                                 id: Math.random().toString(36).substr(2, 9),
                                 name: lead.name,
                                 company: lead.company,
                                 stage: "nuevo",
                                 value: Math.floor(Math.random() * 50000) + 10000,
                                 score: parseInt(lead.match),
                                 last_contact: "Prospectado por IA",
                                 avatar: lead.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
                                 source: "Agente IA"
                               };
                               setLeads(prev => [newScrapedLead, ...prev]);
                               notify(`Prospecto ${lead.name} añadido al pipeline`, "success");
                             }} className="px-3 py-1.5 bg-white text-black rounded-lg text-xs font-medium hover:bg-zinc-200 transition-all flex items-center gap-1.5"><Plus className="w-3 h-3" /> Añadir al Pipeline</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    )}
                  </div>
                )}
              </motion.div>

            ) : activeTab === "analytics" ? (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Financial KPIs Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-white/5 bg-[#111111] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-zinc-500">Ingresos Totales (Mes)</p>
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-semibold text-zinc-100 tabular-nums">$0.00</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-xs text-zinc-600 font-medium">Sin datos suficientes</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#111111] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-zinc-500">Gastos Operativos</p>
                      <Activity className="w-4 h-4 text-red-500" />
                    </div>
                    <p className="text-2xl font-semibold text-zinc-100 tabular-nums">$0.00</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-xs text-zinc-600 font-medium">Sin datos suficientes</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-emerald-400">Ganancia Neta (Utilidad)</p>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-semibold text-emerald-50 tabular-nums">$0.00</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-xs text-emerald-400/80 font-medium">Esperando transacciones...</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-amber-400">{labels.metrics.kpi4}</p>
                      <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-2xl font-semibold text-amber-50 tabular-nums">0</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-xs text-amber-400/80 font-medium">Todo al corriente</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Flujo de Caja Chart */}
                  <div className="rounded-2xl border border-white/5 bg-[#111111] p-8 min-h-[300px] flex flex-col justify-between shadow-sm">
                    <div>
                      <h3 className="text-lg font-medium text-zinc-100 mb-1">Flujo de Caja</h3>
                      <p className="text-sm text-zinc-500">Ingresos vs Gastos últimos 6 meses</p>
                    </div>
                    <div className="flex items-end justify-center gap-4 h-40 mt-8 px-2">
                      <div className="text-center text-zinc-600 text-sm flex flex-col items-center">
                        <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
                        <p>No hay datos financieros aún</p>
                      </div>
                    </div>
                  </div>

                  {/* Eficiencia del Sistema */}
                  <div className="rounded-2xl border border-white/5 bg-[#111111] p-8 min-h-[300px] shadow-sm">
                    <h3 className="text-lg font-medium text-zinc-100 mb-6">Eficiencia y Operación</h3>
                    <div className="space-y-6">
                      {[
                        { label: labels.metrics.eff1, pct: 0, color: "bg-emerald-500" }, 
                        { label: labels.metrics.eff2, pct: 0, color: "bg-blue-500" }, 
                        { label: labels.metrics.eff3, pct: 0, color: "bg-purple-500" }
                      ].map((row, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-zinc-400">{row.label}</span>
                            <span className="text-zinc-500">{row.pct}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${row.pct}%` }} className={cn("h-full rounded-full", row.color)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === "inventory" ? (
              <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-100">{labels.inventory}</h2>
                    <p className="text-sm text-zinc-500">Gestiona tus productos, servicios o recursos.</p>
                  </div>
                  <button onClick={() => notify("Catálogo actualizado. Sincronizando con base de datos...", "success")} className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-sm">
                    <Plus className="w-4 h-4" /> Nuevo Item
                  </button>
                </div>
                
                <div className="rounded-xl border border-white/5 bg-[#111111] overflow-hidden shadow-sm">
                  <div className="grid grid-cols-[1fr_150px_100px_100px] gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <span className="text-xs font-medium text-zinc-500">Nombre del Producto / Servicio</span>
                    <span className="text-xs font-medium text-zinc-500">Categoría</span>
                    <span className="text-xs font-medium text-zinc-500">Stock/Disp.</span>
                    <span className="text-xs font-medium text-zinc-500 text-right">Precio</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {[
                      { name: "Suscripción Premium Anual", category: "Servicio", stock: "Ilimitado", price: 4500 },
                      { name: "Asesoría 1:1 (Hora)", category: "Consultoría", stock: "8 turnos", price: 1200 },
                      { name: "Paquete Básico", category: "Servicio", stock: "Ilimitado", price: 800 }
                    ].map((item, i) => (
                      <div key={i} className="grid grid-cols-[1fr_150px_100px_100px] gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400">
                            <Package className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium text-zinc-200">{item.name}</span>
                        </div>
                        <span className="text-xs text-zinc-500 px-2 py-1 bg-zinc-900 border border-white/5 rounded-md w-fit">{item.category}</span>
                        <span className="text-sm text-zinc-400">{item.stock}</span>
                        <span className="text-sm font-medium text-zinc-200 text-right">${item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : activeTab === "team" ? (
              <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {team.map((member) => (
                  <div key={member.id} className="rounded-2xl border border-white/5 bg-[#111111] p-6 relative group hover:border-white/20 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-sm font-medium text-zinc-300">{member.avatar}</div>
                      <span className={cn("w-2 h-2 rounded-full", member.status === "online" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : member.status === "away" ? "bg-amber-500" : "bg-zinc-600")} />
                    </div>
                    <h3 className="text-lg font-medium text-zinc-100">{member.name}</h3>
                    <p className="text-sm text-zinc-500 mb-4">{member.role}</p>
                    <div className="pt-4 border-t border-white/5 flex gap-2">
                      <button onClick={() => notify(`Enviando email a ${member.name}...`, "info")} className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 transition-all flex justify-center items-center gap-2"><Mail className="w-3 h-3" /> Mail</button>
                      {member.role === "Owner" ? (
                        <button onClick={() => setShowScheduleModal(true)} className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 transition-all flex justify-center items-center gap-2"><Calendar className="w-3 h-3" /> Agenda</button>
                      ) : (
                        <button onClick={async () => {
                          try {
                            const { error } = await supabase.from('team_members').delete().eq('id', member.id);
                            if (error) throw error;
                            setTeam(prev => prev.filter(m => m.id !== member.id));
                            notify(`${member.name} ha sido eliminado de la nave.`, "error");
                          } catch (err) {
                            console.error(err);
                            notify("Error al despedir tripulante", "error");
                          }
                        }} className="flex-1 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-all flex justify-center items-center gap-2"><Trash2 className="w-3 h-3" /> Despedir</button>
                      )}
                    </div>
                  </div>
                ))}
                <button onClick={() => setShowHireModal(true)} className="rounded-2xl border border-dashed border-white/10 bg-transparent hover:bg-white/[0.02] p-6 flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-300 transition-all min-h-[220px]">
                  <UserPlus className="w-8 h-8 mb-4 opacity-50" />
                  <span className="text-sm font-medium">Contratar Tripulante</span>
                </button>
              </motion.div>
            ) : activeTab === "api" ? (
              <motion.div key="api" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-4xl">
                <div className="rounded-2xl border border-white/5 bg-[#111111] overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-base font-medium text-zinc-100 flex items-center gap-2"><Lock className="w-4 h-4" /> API Keys</h2>
                    <button onClick={() => notify("Función en desarrollo: Nueva Key", "info")} className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded-md hover:bg-zinc-200 transition-all">Generar Nueva Key</button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between p-4 bg-[#141414] border border-white/5 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-zinc-200">Production Key</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-zinc-400 font-mono">
                            {showApiKey ? "pk_live_8f7d9a0b1c2d3e4f5a6b7c8d9e0f" : "••••••••••••••••••••••••••••"}
                          </p>
                          <button onClick={() => setShowApiKey(!showApiKey)} className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs ml-2">
                            {showApiKey ? "Ocultar" : "Revelar"}
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-medium rounded border border-emerald-500/20">Activa</span>
                        <button onClick={() => notify("API Key copiada al portapapeles", "success")} className="text-zinc-500 hover:text-zinc-300 text-xs px-2">Copiar</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#111111] overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-base font-medium text-zinc-100 flex items-center gap-2"><Zap className="w-4 h-4" /> Webhooks</h2>
                    <button onClick={() => notify("Función en desarrollo: Añadir Webhook", "info")} className="px-3 py-1.5 bg-[#141414] border border-white/10 text-zinc-300 text-xs font-medium rounded-md hover:bg-white/5 transition-all">Añadir Endpoint</button>
                  </div>
                  <div className="p-0">
                    <div className="grid grid-cols-[1fr_100px_80px] gap-4 px-6 py-3 border-b border-white/5 bg-white/[0.02]">
                      <span className="text-xs font-medium text-zinc-500">URL del Endpoint</span>
                      <span className="text-xs font-medium text-zinc-500">Eventos</span>
                      <span className="text-xs font-medium text-zinc-500 text-right">Estado</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <div>
                        <p className="text-sm font-mono text-zinc-300">https://api.tuempresa.com/webhooks/crm</p>
                        <p className="text-xs text-zinc-500 mt-1">Última entrega: Hace 2 min</p>
                      </div>
                      <div className="flex gap-1 flex-wrap w-24">
                        <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-[9px] rounded">lead.created</span>
                      </div>
                      <div className="text-right">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl space-y-8">
                <div className="rounded-2xl border border-white/5 bg-[#111111] overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-white/5"><h2 className="text-base font-medium text-zinc-100 flex items-center gap-2"><User className="w-4 h-4" /> Perfil Personal</h2></div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xl font-medium text-zinc-300 relative group cursor-pointer">
                        {profile.name.split(' ').map(n=>n[0]).join('')}
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="w-5 h-5 text-white" /></div>
                      </div>
                      <div><h3 className="text-lg font-medium text-zinc-100">{profile.name}</h3><p className="text-sm text-zinc-500">{profile.email}</p></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-xs text-zinc-500 font-medium ml-1">Nombre Completo</label><input type="text" defaultValue={profile.name} className="w-full bg-[#141414] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/20 transition-all" /></div>
                      <div className="space-y-2"><label className="text-xs text-zinc-500 font-medium ml-1">Email</label><input type="email" defaultValue={profile.email} className="w-full bg-[#141414] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/20 transition-all" /></div>
                    </div>
                    <div className="flex justify-end pt-2"><button onClick={() => notify("Perfil actualizado correctamente.", "success")} className="px-6 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-all shadow-sm">Guardar Cambios</button></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#111111] overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-base font-medium text-zinc-100 flex items-center gap-2"><Building className="w-4 h-4" /> Multi-Tenant & Marca Blanca</h2>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-medium rounded border border-blue-500/20">Plan Enterprise</span>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs text-zinc-500 font-medium ml-1">Logo de Inquilino (Tenant)</label>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-zinc-500 hover:text-white transition-all cursor-pointer bg-[#141414]">
                            <Upload className="w-4 h-4" />
                          </div>
                          <p className="text-xs text-zinc-500">Sube tu logo para personalizar la interfaz del CRM para tus clientes.</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-xs text-zinc-500 font-medium ml-1">Nombre de la Instancia</label><input type="text" defaultValue={company.name} className="w-full bg-[#141414] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/20 transition-all" /></div>
                      <div className="space-y-2"><label className="text-xs text-zinc-500 font-medium ml-1">Dominio Personalizado (CNAME)</label><input type="url" defaultValue="crm.tuempresa.com" className="w-full bg-[#141414] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/20 transition-all" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-xs text-zinc-500 font-medium ml-1">Color Principal (Hex)</label>
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-zinc-100 border border-white/10" />
                            <input type="text" defaultValue="#FAFAFA" className="w-full bg-[#141414] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/20 transition-all" />
                         </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-500 font-medium ml-1">Tipo de Negocio (Terminología)</label>
                        <select 
                          value={profile.industry}
                          onChange={(e) => setProfile({...profile, industry: e.target.value})}
                          className="w-full bg-[#141414] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/20 transition-all appearance-none"
                        >
                          <option value="B2B">B2B SaaS (Prospectos, Pipeline)</option>
                          <option value="Gym">Gimnasio / Fitness (Miembros, Suscripciones)</option>
                          <option value="Barberia">Barbería / Salón (Citas, Reservas)</option>
                          <option value="Retail">Tienda / Retail (Clientes, Pedidos)</option>
                          <option value="Inmobiliaria">Bienes Raíces (Compradores, Propiedades)</option>
                          <option value="Clinica">Clínica / Médico (Pacientes, Consultas)</option>
                          <option value="Restaurante">Restaurante / Café (Mesas, Comandas)</option>
                          <option value="Taller">Taller Mecánico (Vehículos, Reparaciones)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2"><button onClick={() => notify("Branding actualizado y propagado a todos los inquilinos.", "success")} className="px-6 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-all shadow-sm">Aplicar Branding</button></div>
                  </div>
                </div>
              </motion.div>

            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Hire Modal */}
      <AnimatePresence>
        {showHireModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHireModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-[#0A0A0A] border border-white/10 rounded-2xl z-[101] shadow-2xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#111111]">
                <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2"><UserPlus className="w-4 h-4 text-emerald-400" /> Nuevo Tripulante</h2>
                <button onClick={() => setShowHireModal(false)} className="text-zinc-500 hover:text-zinc-300 transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-4 font-mono">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Nombre Completo</label>
                  <input type="text" value={hireForm.name} onChange={(e) => setHireForm({...hireForm, name: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/20 transition-all" placeholder="Ej. John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Correo Electrónico</label>
                  <input type="email" value={hireForm.email} onChange={(e) => setHireForm({...hireForm, email: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/20 transition-all" placeholder="john@empresa.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Rol</label>
                  <select value={hireForm.role} onChange={(e) => setHireForm({...hireForm, role: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer">
                    <option value="SDR">SDR (Sales Dev Rep)</option>
                    <option value="Account Executive">Ejecutivo de Cuentas</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <button onClick={handleHire} className="w-full mt-4 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-all">
                  Contratar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lead Detail Drawer */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => {setSelectedLeadId(null); setIsEditing(false);}} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#0A0A0A] border-l border-white/10 z-[101] shadow-2xl flex flex-col">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#111111]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-lg font-medium text-zinc-200">{selectedLead.avatar || "P"}</div>
                  <div><h2 className="text-xl font-semibold text-zinc-100">{selectedLead.name}</h2><p className="text-sm text-zinc-500">{selectedLead.company}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsEditing(!isEditing)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-500 hover:text-zinc-300"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => {setSelectedLeadId(null); setIsEditing(false);}} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-500 hover:text-zinc-300"><X className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#0A0A0A]">
                 <AnimatePresence mode="wait">
                 {isEditing ? (
                   <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-2"><label className="text-xs font-medium text-zinc-500 ml-1">Nombre</label><input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-100 focus:border-white/20 focus:outline-none transition-all" /></div>
                      <div className="space-y-2"><label className="text-xs font-medium text-zinc-500 ml-1">Empresa</label><input type="text" value={editForm.company} onChange={(e) => setEditForm({...editForm, company: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-100 focus:border-white/20 focus:outline-none transition-all" /></div>
                      <div className="space-y-2"><label className="text-xs font-medium text-zinc-500 ml-1">Valor (MXN)</label><input type="number" value={editForm.value} onChange={(e) => setEditForm({...editForm, value: Number(e.target.value)})} className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-100 focus:border-white/20 focus:outline-none transition-all" /></div>
                      <div className="flex items-center gap-3 pt-4">
                         <button onClick={updateLead} className="flex-1 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Guardar</button>
                         <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-[#141414] border border-white/5 text-zinc-300 font-medium rounded-lg hover:bg-white/5 transition-all">Cancelar</button>
                      </div>
                   </motion.div>
                 ) : (
                   <motion.div key="view" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-[#111111] p-4 rounded-xl border border-white/5 shadow-sm">
                           <div className="flex items-center gap-2 text-zinc-500 mb-2"><DollarSign className="w-4 h-4" /><span className="text-xs font-medium">Valor Estimado</span></div>
                           <p className="text-2xl font-semibold text-zinc-100 tabular-nums">${Number(selectedLead.value).toLocaleString()}</p>
                         </div>
                         <div className="bg-[#111111] p-4 rounded-xl border border-white/5 shadow-sm">
                           <div className="flex items-center gap-2 text-zinc-500 mb-2"><Sparkles className="w-4 h-4" /><span className="text-xs font-medium">Score IA</span></div>
                           <div className="flex items-end gap-2"><p className="text-2xl font-semibold text-zinc-100 tabular-nums">{selectedLead.score}%</p><span className="text-xs text-emerald-400 font-medium mb-1">Alta Probabilidad</span></div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-sm font-medium text-zinc-100">Línea de Tiempo de Actividad</h3>
                         <div className="relative border-l border-white/10 ml-3 space-y-6 pb-4">
                            <div className="relative pl-6">
                              <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                              <p className="text-sm font-medium text-zinc-200">Reunión de Descubrimiento Completada</p>
                              <p className="text-xs text-zinc-500 mt-1">Hoy a las 10:30 AM</p>
                              <div className="mt-2 text-xs text-zinc-400 bg-[#111111] p-3 rounded-lg border border-white/5 leading-relaxed">
                                 "El cliente está muy interesado en la automatización del pipeline. Solicitaron una propuesta formal para la próxima semana."
                              </div>
                            </div>
                            <div className="relative pl-6">
                              <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-600" />
                              <p className="text-sm font-medium text-zinc-200">Email Abierto: Presentación Comercial</p>
                              <p className="text-xs text-zinc-500 mt-1">Ayer a las 4:15 PM</p>
                            </div>
                            <div className="relative pl-6 opacity-60">
                              <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-600" />
                              <p className="text-sm font-medium text-zinc-200">Lead Creado vía WhatsApp</p>
                              <p className="text-xs text-zinc-500 mt-1">Hace 3 días</p>
                            </div>
                         </div>
                      </div>

                      <div className="pt-6 border-t border-white/5 space-y-4">
                         <h3 className="text-sm font-medium text-zinc-100">Acciones Rápidas</h3>
                         <div className="grid grid-cols-2 gap-3">
                           <button onClick={() => notify("Acción rápida: Email enviado", "success")} className="flex items-center justify-center gap-2 py-2.5 bg-[#141414] border border-white/5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-zinc-100 transition-all"><Mail className="w-4 h-4" /> Enviar Email</button>
                           <button onClick={() => setShowScheduleModal(true)} className="flex items-center justify-center gap-2 py-2.5 bg-[#141414] border border-white/5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-zinc-100 transition-all"><Calendar className="w-4 h-4" /> Agendar</button>
                         </div>
                      </div>
                   </motion.div>
                 )}
                 </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <div className="fixed bottom-6 right-6 z-[150] space-y-3 flex flex-col items-end pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={cn("px-5 py-3 rounded-lg text-sm font-medium shadow-lg flex items-center gap-3 pointer-events-auto border",
                n.type === "success" ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/20" : 
                n.type === "error" ? "bg-red-950/80 text-red-400 border-red-500/20" : 
                "bg-zinc-900/90 text-zinc-300 border-white/10"
              )}>
              {n.type === "success" && <ShieldCheck className="w-4 h-4" />}
              {n.type === "error" && <X className="w-4 h-4" />}
              {n.type === "info" && <Bell className="w-4 h-4" />}
              {n.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        setIsOpen={setIsCommandPaletteOpen}
        onAddLead={() => setShowCreateLeadModal(true)}
        onChangeTab={(tab) => setActiveTab(tab)}
      />

      {/* Create Lead Modal */}
      <AnimatePresence>
        {showCreateLeadModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateLeadModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-medium text-zinc-100">Crear {labels.newLead}</h3>
                <button onClick={() => setShowCreateLeadModal(false)} className="text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 ml-1">Nombre del {labels.lead}</label>
                  <input type="text" value={newLeadForm.name} onChange={(e) => setNewLeadForm({...newLeadForm, name: e.target.value})} placeholder="Ej. Carlos Slim" className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-100 focus:border-white/20 focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 ml-1">Empresa</label>
                  <input type="text" value={newLeadForm.company} onChange={(e) => setNewLeadForm({...newLeadForm, company: e.target.value})} placeholder="Ej. Grupo Carso" className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-100 focus:border-white/20 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 ml-1">Valor Estimado ($)</label>
                    <input type="number" value={newLeadForm.value} onChange={(e) => setNewLeadForm({...newLeadForm, value: e.target.value})} placeholder="50000" className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-100 focus:border-white/20 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 ml-1">Origen</label>
                    <select value={newLeadForm.source} onChange={(e) => setNewLeadForm({...newLeadForm, source: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-100 focus:border-white/20 focus:outline-none">
                       <option value="Manual">Manual</option>
                       <option value="API">API</option>
                       <option value="Webhook">Webhook</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-2 flex items-center gap-3">
                <button onClick={submitNewLead} className="flex-1 py-2.5 bg-white text-black font-medium text-sm rounded-lg hover:bg-zinc-200 transition-colors">
                   Crear {labels.lead}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowScheduleModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-medium text-zinc-100">Agendar Nueva Cita</h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 ml-1">Título del Evento</label>
                  <input type="text" placeholder="Ej. Demostración de Producto" className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-100 focus:border-white/20 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 ml-1">Fecha</label>
                    <input type="date" className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-400 focus:border-white/20 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 ml-1">Hora</label>
                    <input type="time" className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-400 focus:border-white/20 focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 ml-1">Invitados (Emails separados por coma)</label>
                  <input type="text" placeholder="cliente@empresa.com" className="w-full bg-[#141414] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-zinc-100 focus:border-white/20 focus:outline-none" />
                </div>
              </div>
              <div className="p-6 pt-2 flex items-center gap-3">
                <button onClick={() => {
                  setShowScheduleModal(false);
                  notify("Cita agendada correctamente", "success");
                }} className="flex-1 py-2.5 bg-white text-black font-medium text-sm rounded-lg hover:bg-zinc-200 transition-colors">
                  Confirmar y Enviar Invitación
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
