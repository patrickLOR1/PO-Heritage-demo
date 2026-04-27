import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/site-config";
import { checkRateLimit, sanitizeInput } from "@/lib/security";

// Lazy-initialize Groq so build doesn't fail when GROQ_API_KEY is missing
function getGroqClient() {
  if (!process.env.GROQ_API_KEY) return null;
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export async function POST(req: Request) {
  try {
    const groq = getGroqClient();

    if (!groq) {
      return NextResponse.json(
        { error: "Servicio de IA no configurado. Configura GROQ_API_KEY." },
        { status: 503 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { allowed } = await checkRateLimit(ip, 5, 1); // 5 requests per minute

    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Por favor espera un minuto." },
        { status: 429 }
      );
    }

    const { messages } = await req.json();

    // Sanitize last user message
    const sanitizedMessages = messages.map((m: any) => ({
      ...m,
      content: sanitizeInput(m.content),
    }));

    const systemPrompt = `
      Eres ARIA, la asistente virtual de PO Heritage — una agencia de desarrollo web y automatización.
      Tu objetivo es ayudar a los visitantes a entender cómo podemos hacer crecer su negocio con tecnología.

      PERSONALIDAD:
      - Profesional, amigable y orientada a resultados.
      - Usas un lenguaje claro y directo, sin tecnicismos innecesarios.
      - Eres experta en sitios web, chatbots, automatización y CRMs personalizados.

      CONTEXTO DE LA EMPRESA:
      - Nombre: ${SITE_CONFIG.company.name}
      - Servicios: Sitios web premium, chatbots de WhatsApp, automatización de negocios, CRMs a la medida.
      - Precios: Starter $2,500 MXN | Growth $4,500 MXN | Scale $8,500 MXN.

      REGLAS:
      - Responde siempre en español.
      - Si preguntan por precios, menciona los tres planes.
      - Siempre intenta agendar una llamada o redirigir al botón "Agendar Llamada".
      - Mantén las respuestas cortas y de alto impacto (máx 3 oraciones).
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedMessages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      content: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Error in ARIA AI:", error);
    return NextResponse.json(
      { error: "Error procesando tu mensaje. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
