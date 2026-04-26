import Navbar from "@/components/marketing/Navbar";
import PricingTable from "@/components/marketing/PricingTable";
import Faq from "@/components/marketing/Faq";
import Footer from "@/components/marketing/Footer";

export default function PricingPage() {
  return (
    <main className="relative">
      <Navbar />
      <div className="pt-24 lg:pt-32">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center mb-16">
          <h1 className="text-[42px] lg:text-[64px] font-bold text-white tracking-tight mb-6">
            Planes y <span className="text-gradient">Precios.</span>
          </h1>
          <p className="text-[17px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Inversión inteligente diseñada para escalar contigo. 
            Sin costos ocultos, sin complicaciones.
          </p>
        </div>
        <PricingTable />
        <Faq />
      </div>
      <Footer />
    </main>
  );
}
