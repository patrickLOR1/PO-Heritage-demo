export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ prospects: [], message: "IA no configurada." });
    }

    const { Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey });

    const { industry, location, size } = await request.json();

    const prompt = `Genera una lista de 5 empresas ficticias pero realistas en la industria "${industry}" ubicadas en "${location}" de tamaño "${size}". Para cada una devuelve JSON con: name, company, email, phone, score (1-100), value (estimado en MXN). Solo responde con el JSON array, sin explicaciones.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Eres un generador de datos de prospectos B2B. Solo responde JSON válido." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content || "[]";
    let prospects = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) prospects = JSON.parse(jsonMatch[0]);
    } catch {
      prospects = [];
    }

    return NextResponse.json({ prospects });
  } catch (error: any) {
    console.error("Prospector Error:", error);
    return NextResponse.json({ prospects: [], error: error.message }, { status: 500 });
  }
}
