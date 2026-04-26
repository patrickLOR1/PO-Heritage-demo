# PO Heritage — Boilerplate Maestro (Atombox Edition)

> CRM de próxima generación con IA. Next.js 14 · Tailwind CSS · Framer Motion · Supabase · Groq

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14+ (App Router) |
| Estilos | Tailwind CSS v4 + CSS Variables |
| Animaciones | Framer Motion |
| BaaS | Supabase (Auth, DB, Edge Functions) |
| IA | Groq SDK (Llama 3 70B) |
| Utilidades | clsx · tailwind-merge · lucide-react |

## Estructura del Proyecto

```
po-heritage-temp/
├── app/
│   ├── api/
│   │   └── chat/route.ts        # Endpoint ARIA SDR (Groq)
│   ├── dashboard/
│   │   └── page.tsx             # Pipeline de prospectos
│   ├── globals.css              # Design system tokens
│   ├── layout.tsx               # Root layout + SEO metadata
│   └── page.tsx                 # Landing page
├── components/
│   ├── dashboard/
│   │   └── LeadsDashboard.tsx   # Atom Finance-style pipeline
│   └── marketing/
│       ├── Navbar.tsx           # Sticky nav con blur
│       ├── Hero.tsx             # Hero conversion-focused
│       ├── Services.tsx         # Feature cards
│       ├── PricingTable.tsx     # Atombox clone (Blue & Steel)
│       ├── AiChat.tsx           # Chat widget ARIA
│       └── Footer.tsx
├── lib/
│   ├── site-config.ts           # ⭐ MASTER CONFIG (todo el contenido)
│   ├── supabase.ts              # Clientes Supabase (browser + server)
│   └── utils.ts                 # cn(), formatCurrency()
└── .env.example                 # Variables de entorno requeridas
```

## Setup Rápido

### 1. Variables de entorno
```bash
cp .env.example .env.local
```
Rellena en `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` → URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Anon key de Supabase
- `GROQ_API_KEY` → API key de [console.groq.com](https://console.groq.com)

### 2. Instalar y correr
```bash
npm install
npm run dev
```

### 3. Abrir en el navegador
- **Landing:** http://localhost:3000
- **Dashboard:** http://localhost:3000/dashboard
- **API Chat:** POST http://localhost:3000/api/chat

## Personalización

Todo el contenido del sitio se controla desde un único archivo:

```
lib/site-config.ts
```

Cambia precios, textos, servicios, leads de muestra — sin tocar los componentes.

## Filosofía Visual (Blue & Steel)

| Token | Valor |
|-------|-------|
| Fondo base | `#030712` |
| Fondo card | `#080f1a` |
| Azul eléctrico | `#3B82F6` |
| Gris acero | `#94A3B8` |
| Bordes | `rgba(255,255,255,0.06)` |

## API — `/api/chat`

```http
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Hola, me interesa saber más sobre PO Heritage" }
  ]
}
```

Respuesta:
```json
{
  "message": "¡Hola! Soy ARIA...",
  "usage": { "prompt_tokens": 120, "completion_tokens": 85 },
  "model": "llama3-70b-8192"
}
```

## Esquema Supabase (sugerido)

```sql
-- Prospectos capturados por ARIA
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text unique,
  stage text default 'nuevo',
  value numeric default 0,
  ai_score integer default 0,
  conversation jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Conversaciones con ARIA
create table conversations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);
```
