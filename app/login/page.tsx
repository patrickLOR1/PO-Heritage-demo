"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/site-config";
import { Shield, ArrowRight, Lock, Mail, Activity, Building } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        if (!companyName.trim()) {
          alert("El nombre de tu empresa es obligatorio.");
          setLoading(false);
          return;
        }

        // 1. Crear usuario en Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          alert(error.message);
        } else if (data.user) {
          // 2. Crear organización
          const { data: org, error: orgError } = await supabase
            .from('organizations')
            .insert([{ name: companyName }])
            .select()
            .single();

          if (!orgError && org) {
            // 3. Vincular usuario como Owner de esa organización
            await supabase.from('team_members').insert([{
              org_id: org.id,
              user_id: data.user.id,
              name: email.split('@')[0],
              email: email,
              role: 'Owner',
              status: 'online',
              avatar: email.split('@')[0].substring(0, 2).toUpperCase()
            }]);
          }

          alert("¡Cuenta creada! Ahora inicia sesión.");
          setIsSignUp(false);
          setCompanyName("");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          alert(error.message);
        } else if (data.session) {
          localStorage.removeItem("po_heritage_auth");
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error en autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert("Escribe tu correo primero.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert(error.message);
    else alert("Te enviamos un link de recuperación a tu correo.");
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">PO Heritage</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight text-center">
            {isSignUp ? "Crear una cuenta" : "Bienvenido de nuevo"}
          </h1>
          <p className="text-slate-500 text-sm mt-2 text-center">
            {isSignUp ? "Ingresa tus datos para registrarte" : "Ingresa tus credenciales para acceder al CRM"}
          </p>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl noise">
          <form onSubmit={handleAuth} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Nombre de tu Empresa</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ej. Mi Gimnasio, Barbería Don Juan..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@empresa.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Contraseña</label>
                {!isSignUp && (
                  <a href="#" onClick={(e) => { e.preventDefault(); handleResetPassword(); }} className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">¿Olvidaste tu contraseña?</a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-widest font-bold">
              <span className="bg-[#0a1628] px-4 text-slate-500">O</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            {isSignUp ? "¿Ya tienes cuenta? Inicia Sesión" : "¿No tienes cuenta? Regístrate"}
          </button>
        </div>

        {!isSignUp && (
          <p className="text-center text-slate-500 text-[13px] mt-8">
            ¿Empresa grande?{" "}
            <Link href="/solicitar-acceso" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Solicitar plan Enterprise</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
