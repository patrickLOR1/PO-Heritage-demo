import type { Metadata } from "next";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidad · PO Heritage",
  description: "Información sobre cómo protegemos y gestionamos tus datos.",
};

export default function PrivacyPage() {
  const { company } = SITE_CONFIG;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#030712] pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <h1 className="text-[42px] font-bold text-white tracking-tight mb-4">Política de Privacidad</h1>
          <p className="text-slate-500 text-sm mb-12 font-mono">Última actualización: 25 de abril, 2026</p>

          <div className="prose prose-invert prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-blue-400 mb-4">1. Introducción</h2>
              <p className="text-slate-400 leading-relaxed">
                En {company.name}, valoramos tu privacidad y estamos comprometidos con la protección de tus datos personales. Esta política explica cómo recopilamos, usamos y protegemos la información a través de nuestra plataforma de CRM e Inteligencia Comercial.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-400 mb-4">2. Información que Recopilamos</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                Recopilamos información necesaria para el funcionamiento de nuestros servicios de SDR e IA, incluyendo:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-400">
                <li>Datos de contacto (nombre, email, teléfono).</li>
                <li>Información de la empresa y del pipeline de ventas.</li>
                <li>Logs de interacción con nuestra IA (ARIA).</li>
                <li>Datos técnicos (dirección IP, tipo de navegador, cookies).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-400 mb-4">3. Uso de la Inteligencia Artificial</h2>
              <p className="text-slate-400 leading-relaxed">
                Nuestra IA procesa datos de prospectos para calificación y automatización. No vendemos tus datos de entrenamiento a terceros. Utilizamos modelos de lenguaje de vanguardia (Groq/Llama 3) bajo estrictos acuerdos de privacidad y procesamiento de datos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-400 mb-4">4. Cookies y Seguimiento</h2>
              <p className="text-slate-400 leading-relaxed">
                Utilizamos cookies esenciales para mantener tu sesión y cookies analíticas para mejorar la experiencia de usuario. Puedes gestionar las preferencias de cookies desde la configuración de tu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-400 mb-4">5. Seguridad de los Datos</h2>
              <p className="text-slate-400 leading-relaxed">
                Implementamos cifrado de grado militar (AES-256) y protocolos de seguridad SSL para proteger toda la información que fluye a través de {company.name}.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-400 mb-4">6. Contacto</h2>
              <p className="text-slate-400 leading-relaxed">
                Si tienes dudas sobre esta política, contáctanos en: <br />
                <span className="text-white font-medium">{company.email}</span>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
