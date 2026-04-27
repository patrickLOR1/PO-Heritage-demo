export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      source = "Webhook API",
      value = 0,
      stage = "nuevo",
    } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "El campo 'name' es requerido." }, { status: 400 });
    }

    const newLead = {
      name,
      company: company || "Desconocida",
      stage,
      value: Number(value),
      score: 50,
      last_contact: new Date().toISOString(),
      avatar: name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase(),
      source,
      phone,
      email,
    };

    // Dynamic import to avoid build-time module evaluation
    const { supabase } = await import("@/lib/supabase");
    const { data, error } = await supabase.from("leads").insert([newLead]).select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Lead integrado exitosamente al Pipeline Automático",
      data: data?.[0] ?? newLead,
    });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
