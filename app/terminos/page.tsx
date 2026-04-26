import type { Metadata } from "next";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Términos y Condiciones · PO Heritage",
  description: "Términos de servicio para el uso de nuestra plataforma CRM e IA.",
};

export default function TermsPage() {
  const { company } = SITE_CONFIG;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#030712] pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <h1 className="text-[42px] font-bold text-white tracking-tight mb-4">Términos y Condiciones</h1>
          <p className="text-slate-500 text-sm mb-12 font-mono">Última actualización: 25 de abril, 2026</p>

          <div className="prose prose-invert prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-blue-400 mb-4">1. Aceptación de los Términos</h2>
              <p className="text-slate-400 leading-relaxed">
                Al acceder y utilizar {company.name}, aceptas cumplir con estos términos. Si no estás de acuerdo con alguna parte de los términos, no podrás utilizar nuestros servicios de IA y CRM.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-400 mb-4">2. Uso de la Plataforma</h2>
              <p className="text-slate-400 leading-relaxed">
                Nuestra plataforma está diseñada para uso empresarial. Te comprometes a proporcionar información veraz y a no utilizar el sistema para actividades ilegales, spam o manipulación de datos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-400 mb-4">3. Servicios de IA (ARIA)</h2>
              <p className="text-slate-400 leading-relaxed">
                ARIA es un asistente inteligente. Aunque nos esforzamos por la precisión, no garantizamos que las respuestas de la IA estén libres de errores. El usuario es responsable de la supervisión final de las interacciones comerciales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-400 mb-4">4. Propiedad Intelectual</h2>
              <p className="text-slate-400 leading-relaxed">
                Todo el contenido, algoritmos y software de la plataforma son propiedad exclusiva de {company.name}. No se permite la ingeniería inversa o reproducción total o parcial del sistema.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-400 mb-4">5. Limitación de Responsabilidad</h2>
              <p className="text-slate-400 leading-relaxed">
                {company.name} no será responsable por pérdidas de datos, lucro cesante o daños derivados del uso de la plataforma, incluso si se nos ha notificado de la posibilidad de tales daños.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-400 mb-4">6. Modificaciones</h2>
              <p className="text-slate-400 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de la plataforma después de dichos cambios constituye la aceptación de los nuevos términos.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
