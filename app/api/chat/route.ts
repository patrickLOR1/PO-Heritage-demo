import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/site-config";
import { checkRateLimit, sanitizeInput } from "@/lib/security";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
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
      content: sanitizeInput(m.content)
    }));

    const systemPrompt = `
      Eres ARIA (Automated Revenue Intelligence Assistant), la IA de élite de PO Heritage.
      Tu objetivo es ayudar a empresarios y directores comerciales a automatizar sus ventas.
      
      PERSONALIDAD:
      - Profesional, sofisticada y orientada a resultados.
      - Usas un lenguaje premium pero directo.
      - Eres experta en CRM, prospección B2B y automatización de pipelines.
      
      CONTEXTO DE LA EMPRESA:
      - Nombre: ${SITE_CONFIG.company.name}
      - Servicios: Automatización de prospección, Calificación de leads con IA, Integración de CRM.
      - Estética: Alta tecnología, seguridad y exclusividad ("Blue & Steel").
      
      REGLAS:
      - Responde siempre en español.
      - Si te preguntan por precios, menciona que el plan SDR comienza en $4,900 MXN/mes.
      - Intenta siempre dirigir la conversación hacia la "Solicitud de Acceso" para una demo personalizada.
      - Mantén las respuestas concisas y de alto impacto.
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedMessages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({ 
      content: response.choices[0].message.content 
    });
  } catch (error: any) {
    console.error("Error in ARIA AI:", error);
    return NextResponse.json(
      { error: "Error procesando tu mensaje. Asegúrate de tener una GROQ_API_KEY en .env.local" },
      { status: 500 }
    );
  }
}
