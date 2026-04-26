import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/security';

// Este endpoint permite a servicios como Zapier, Make, HubSpot o WhatsApp
// inyectar prospectos directamente en tu Pipeline automatizado.
export async function POST(request: Request) {
  try {
    // 1. Rate Limiting de seguridad
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimit(ip, 20, 1); // 20 requests per minute for webhooks
    
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
    }

    // 2. Extraer datos del webhook entrante
    const body = await request.json();
    
    const { 
      name, 
      email, 
      phone, 
      company, 
      source = "Webhook API",
      value = 0,
      stage = "nuevo"
    } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "El campo 'name' es requerido." }, { status: 400 });
    }

    // 3. Crear el Prospecto
    const newLead = {
      name,
      company: company || "Desconocida",
      stage,
      value: Number(value),
      score: 50, // Default score
      last_contact: new Date().toISOString(),
      avatar: name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase(),
      source,
      phone,
      email
    };

    // 4. Insertar en Supabase
    const { data, error } = await supabase.from('leads').insert([newLead]).select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: "Lead integrado exitosamente al Pipeline Automático",
      data: data[0]
    });

  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
