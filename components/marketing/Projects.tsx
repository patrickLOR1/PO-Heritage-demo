"use client";

import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Layout, Bot, Database } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    title: "Riviera Luxury Real Estate",
    category: "Web Design & SEO",
    description: "Landing page de alta conversión para desarrollos inmobiliarios en Tulum. Integración con CRM y optimización de velocidad.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    tags: ["Next.js", "Tailwind", "SEO"],
    icon: Layout
  },
  {
    title: "Elite Fitness Management",
    category: "Custom CRM",
    description: "Sistema completo de gestión para gimnasios. Control de accesos, pagos recurrentes y dashboard de métricas en tiempo real.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    tags: ["React", "Supabase", "Stripe"],
    icon: Database
  },
  {
    title: "GastroBot AI",
    category: "Automation",
    description: "Chatbot de WhatsApp con IA para cadena de restaurantes. Reservaciones automáticas y atención al cliente 24/7.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    tags: ["Python", "Groq", "WhatsApp API"],
    icon: Bot
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12px] font-semibold uppercase tracking-[0.14em] text-blue-400/80 mb-4"
          >
            Casos de Éxito
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="text-[38px] lg:text-[46px] font-bold tracking-[-0.025em] leading-[1.1] text-white"
          >
            Proyectos que impulsan{" "}
            <span className="text-gradient">negocios reales.</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex flex-col rounded-2xl border border-white/[0.065] bg-[#060d1a] overflow-hidden hover:border-white/[0.12] transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060d1a] via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <project.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-[18px] font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                </div>
                
                <p className="text-[14px] text-slate-500 leading-relaxed mb-6 flex-1">
                  {project.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-mono text-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button className="flex items-center gap-1.5 text-[12px] font-semibold text-white group/btn">
                    Ver más
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
