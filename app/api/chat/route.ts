export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/site-config";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { content: "Servicio de IA no disponible. Escríbenos por WhatsApp." },
        { status: 200 }
      );
    }

    const { Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey });

    const { messages } = await req.json();

    const sanitizedMessages = messages.map((m: any) => ({
      ...m,
      content: (m.content || "").replace(/[<>]/g, ""),
    }));

    const systemPrompt = `
      Eres ARIA, la asistente virtual de PO Heritage — una agencia de desarrollo web y automatización.
      Tu objetivo es ayudar a los visitantes a entender cómo podemos hacer crecer su negocio con tecnología.

      PERSONALIDAD:
      - Profesional, amigable y orientada a resultados.
      - Usas un lenguaje claro y directo, sin tecnicismos innecesarios.

      CONTEXTO DE LA EMPRESA:
      - Nombre: ${SITE_CONFIG.company.name}
      - Servicios: Sitios web premium, chatbots de WhatsApp, automatización de negocios, CRMs a la medida.
      - Precios: Starter $2,500 MXN | Growth $4,500 MXN | Scale $8,500 MXN.

      REGLAS:
      - Responde siempre en español.
      - Si preguntan por precios, menciona los tres planes.
      - Siempre intenta agendar una llamada o redirigir al botón "Agendar Llamada".
      - Mantén las respuestas cortas (máx 3 oraciones).
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
    console.error("ARIA Error:", error);
    return NextResponse.json(
      { content: "Error procesando tu mensaje. Intenta de nuevo." },
      { status: 200 }
    );
  }
}
