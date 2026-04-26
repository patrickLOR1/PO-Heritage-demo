import Navbar from "@/components/marketing/Navbar";
import Services from "@/components/marketing/Services";
import Footer from "@/components/marketing/Footer";
import AiChat from "@/components/marketing/AiChat";
import { motion } from "framer-motion";

export default function ServicesPage() {
  return (
    <main className="relative">
      <Navbar />
      <div className="pt-24 lg:pt-32">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center mb-16">
          <h1 className="text-[42px] lg:text-[64px] font-bold text-white tracking-tight mb-6">
            Nuestros <span className="text-gradient">Servicios.</span>
          </h1>
          <p className="text-[17px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Desde SDRs de inteligencia artificial hasta pipelines automatizados de grado militar. 
            PO Heritage redefine la forma en que las empresas cierran tratos.
          </p>
        </div>
        <Services />
        <AiChat />
      </div>
      <Footer />
    </main>
  );
}
