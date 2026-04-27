export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/site-config";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        content: "¡Hola! Soy ARIA. Escríbenos por WhatsApp para una cotización personalizada.",
      });
    }

    const { messages } = await req.json();

    const sanitizedMessages = messages.map((m: any) => ({
      role: m.role,
      content: (m.content || "").replace(/[<>]/g, ""),
    }));

    const systemPrompt = `Eres ARIA, la asistente virtual de ${SITE_CONFIG.company.name} — una agencia de desarrollo web y automatización.
Servicios: Sitios web premium, chatbots de WhatsApp, automatización de negocios, CRMs a la medida.
Precios: Starter $2,500 MXN | Growth $4,500 MXN | Scale $8,500 MXN.
Responde siempre en español. Respuestas cortas (máx 3 oraciones). Intenta agendar una llamada.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...sanitizedMessages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      content: data.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("ARIA Error:", error);
    return NextResponse.json({
      content: "Disculpa, tuve un error. Escríbenos por WhatsApp para ayudarte.",
    });
  }
}
