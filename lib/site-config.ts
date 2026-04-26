// ============================================================
// SITE_CONFIG — PO Heritage Digital Agency Configuration
// Agencia de Sitios Web, Automatización e IA
// ============================================================

export const SITE_CONFIG = {
  company: {
    name: "PO Heritage",
    tagline: "Agencia de Desarrollo Web & Automatización",
    description:
      "Creamos sitios web de alto impacto y sistemas de automatización que generan clientes reales para tu negocio. Diseño premium. Resultados medibles.",
    url: "https://poheritage.mx",
    logo: "/brand/logo-new.png",
    email: "hola@poheritage.mx",
    phone: "+52 984 144 1658",
    founded: 2024,
  },

  hero: {
    badge: "Agencia Digital · México",
    headline: "Tu negocio necesita",
    headlineAccent: "clientes, no likes.",
    subheadline:
      "Diseñamos sitios web que convierten visitantes en clientes y construimos automatizaciones que trabajan por ti 24/7. Sin plantillas genéricas. Sin promesas vacías.",
    cta: {
      primary: "Agendar Llamada",
      secondary: "Ver Portafolio",
    },
    stats: [
      { value: "50+", label: "Proyectos entregados" },
      { value: "3.2x", label: "Más leads vs antes" },
      { value: "24/7", label: "Bots trabajando" },
    ],
  },

  services: [
    {
      id: "web-design",
      icon: "Globe",
      title: "Sitios Web Premium",
      description:
        "Landing pages y sitios web diseñados para convertir. SEO, velocidad, y diseño que genera confianza desde el primer segundo.",
      highlight: true,
    },
    {
      id: "automation",
      icon: "Bot",
      title: "Automatización & Bots",
      description:
        "Chatbots de WhatsApp, respuestas automáticas, seguimiento de leads y flujos que cierran ventas mientras duermes.",
    },
    {
      id: "crm",
      icon: "BarChart3",
      title: "CRMs a la Medida",
      description:
        "Sistemas de gestión personalizados para tu negocio: gimnasios, clínicas, barberías, inmobiliarias y más.",
    },
    {
      id: "branding",
      icon: "Palette",
      title: "Branding & Estrategia",
      description:
        "Identidad visual profesional, estrategia de contenido y posicionamiento digital que te diferencia de la competencia.",
    },
  ],

  pricing: {
    currency: "MXN",
    currencySymbol: "$",
    billingToggle: true,
    annualDiscount: 20,
    plans: [
      {
        id: "starter",
        name: "Starter",
        description: "Perfecto para emprendedores que necesitan presencia digital profesional.",
        monthlyPrice: 2500,
        annualPrice: 2000,
        color: "steel",
        badge: null,
        stripePriceId: "",
        stripeAnnualPriceId: "",
        features: [
          { text: "Landing page de 1 página", included: true },
          { text: "Diseño responsive premium", included: true },
          { text: "Formulario de contacto integrado", included: true },
          { text: "Optimización SEO básica", included: true },
          { text: "Entrega en 7 días", included: true },
          { text: "Chatbot de WhatsApp", included: false },
          { text: "CRM personalizado", included: false },
          { text: "Automatizaciones avanzadas", included: false },
        ],
        cta: "Solicitar Cotización",
      },
      {
        id: "growth",
        name: "Growth",
        description: "Para negocios que quieren generar clientes en automático.",
        monthlyPrice: 4500,
        annualPrice: 3600,
        color: "blue",
        badge: "Más Popular",
        highlighted: true,
        stripePriceId: "",
        stripeAnnualPriceId: "",
        features: [
          { text: "Sitio web completo (hasta 5 páginas)", included: true },
          { text: "Diseño premium a la medida", included: true },
          { text: "SEO avanzado + Google Analytics", included: true },
          { text: "Chatbot de WhatsApp con IA", included: true },
          { text: "Integración con redes sociales", included: true },
          { text: "Automatización de seguimiento", included: true },
          { text: "CRM personalizado", included: false },
          { text: "Soporte y mantenimiento mensual", included: false },
        ],
        cta: "Agendar Llamada",
      },
      {
        id: "scale",
        name: "Scale",
        description: "Solución completa: web + automatización + CRM para tu negocio.",
        monthlyPrice: 8500,
        annualPrice: 6800,
        color: "steel",
        badge: "Todo Incluido",
        stripePriceId: "",
        stripeAnnualPriceId: "",
        features: [
          { text: "Sitio web ilimitado + blog", included: true },
          { text: "Diseño ultra-premium personalizado", included: true },
          { text: "SEO + SEM + estrategia de contenido", included: true },
          { text: "Bot de WhatsApp + Instagram + Facebook", included: true },
          { text: "Automatización completa del negocio", included: true },
          { text: "CRM a la medida de tu industria", included: true },
          { text: "Dashboard de métricas en tiempo real", included: true },
          { text: "Soporte y mantenimiento 3 meses", included: true },
        ],
        cta: "Hablar con Patrick",
      },
    ],
  },

  dashboard: {
    title: "Pipeline de Prospectos",
    stages: [
      { id: "nuevo", label: "Nuevo", color: "#3B82F6" },
      { id: "contactado", label: "Contactado", color: "#8B5CF6" },
      { id: "calificado", label: "Calificado", color: "#F59E0B" },
      { id: "propuesta", label: "Propuesta", color: "#10B981" },
      { id: "cerrado", label: "Cerrado", color: "#22C55E" },
    ],
    sampleLeads: [
      {
        id: "L-001",
        name: "Rodrigo Méndez",
        company: "ConstructX SA",
        stage: "calificado",
        value: 45000,
        score: 87,
        lastContact: "Hace 2 horas",
        avatar: "RM",
      },
      {
        id: "L-002",
        name: "Ana Sofía Torres",
        company: "Fintech Mx",
        stage: "propuesta",
        value: 120000,
        score: 94,
        lastContact: "Hace 30 min",
        avatar: "AT",
      },
      {
        id: "L-003",
        name: "Carlos Ibáñez",
        company: "Retail Pro",
        stage: "contactado",
        value: 28000,
        score: 62,
        lastContact: "Hace 1 día",
        avatar: "CI",
      },
      {
        id: "L-004",
        name: "Mariana Vega",
        company: "LogiStart",
        stage: "nuevo",
        value: 75000,
        score: 71,
        lastContact: "Hace 3 horas",
        avatar: "MV",
      },
      {
        id: "L-005",
        name: "Diego Ramírez",
        company: "SaaS Corp",
        stage: "cerrado",
        value: 210000,
        score: 98,
        lastContact: "Ayer",
        avatar: "DR",
      },
    ],
  },

  nav: {
    links: [
      { label: "Inicio", href: "/" },
      { label: "Servicios", href: "/servicios" },
      { label: "Precios", href: "/precios" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    cta: "Agendar Llamada",
  },

  faq: [
    {
      q: "¿Cuánto tiempo toman en entregar un sitio web?",
      a: "Depende del plan. Una landing page la entregamos en 7 días. Un sitio completo con automatización toma entre 2-4 semanas. Siempre con revisiones incluidas."
    },
    {
      q: "¿Qué tipo de bots pueden crear?",
      a: "Chatbots de WhatsApp que responden preguntas frecuentes, agendan citas, califican prospectos y envían cotizaciones automáticamente. También bots para Instagram y Facebook Messenger."
    },
    {
      q: "¿Necesito conocimientos técnicos para manejar mi sitio?",
      a: "Para nada. Te entregamos todo listo y te enseñamos a usar tu panel. Si algo se rompe, nosotros lo arreglamos. Sin complicaciones."
    },
    {
      q: "¿Qué es un CRM a la medida?",
      a: "Es un sistema personalizado para manejar tu negocio: clientes, ventas, inventario, empleados y métricas. Lo diseñamos específicamente para tu industria — gimnasios, barberías, clínicas, restaurantes, etc."
    }
  ],

  footer: {
    tagline: "Diseñamos tecnología que genera clientes.",
    links: [
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
      { label: "Contacto", href: "mailto:hola@poheritage.mx" },
    ],
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
export type PricingPlan = (typeof SITE_CONFIG.pricing.plans)[number];
export type Lead = (typeof SITE_CONFIG.dashboard.sampleLeads)[number];
