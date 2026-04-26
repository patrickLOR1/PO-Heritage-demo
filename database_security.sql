-- =====================================================================
-- PO HERITAGE CRM - ESQUEMA MULTI-TENANT COMPLETO
-- Ejecuta esto en el SQL Editor de Supabase para crear toda la estructura
-- =====================================================================

-- ATENCIÓN: Esto borrará las tablas actuales para aplicar la nueva estructura.
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS rate_limits CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- =====================================================================
-- 1. ORGANIZACIONES (Empresas Cliente)
-- =====================================================================
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE, -- ej: crm.empresa.com
  industry TEXT DEFAULT 'B2B', -- B2B, Gym, Barberia, Retail, Inmobiliaria, Clinica, Restaurante, Taller
  plan TEXT DEFAULT 'Core', -- Core, Tactical, Enterprise
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- 2. EQUIPO (Relaciona Auth User con su Empresa)
-- =====================================================================
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id), -- Conectado al Auth de Supabase
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'SDR', -- Owner, Manager, SDR
  status TEXT DEFAULT 'online',
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- 3. LEADS / PROSPECTOS (Aislados por Empresa)
-- =====================================================================
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  stage TEXT DEFAULT 'nuevo',
  value NUMERIC DEFAULT 0,
  score INTEGER DEFAULT 0,
  source TEXT DEFAULT 'Manual',
  phone TEXT,
  email TEXT,
  last_contact TEXT DEFAULT 'Recién llegado',
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- 4. BANDEJA DE ENTRADA (Aislada por Empresa)
-- =====================================================================
CREATE TABLE emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  time TEXT DEFAULT 'Ahora',
  avatar TEXT DEFAULT 'U',
  unread BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- 5. INVENTARIO (Productos, Servicios, Clases, Refacciones, etc.)
-- =====================================================================
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  stock TEXT DEFAULT '0', -- Puede ser "Ilimitado", "8 turnos", etc.
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- 6. TRANSACCIONES (Ingresos y Gastos — Finanzas del negocio)
-- =====================================================================
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')), -- Ingreso o Gasto
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  category TEXT DEFAULT 'General', -- Membresía, Nómina, Renta, Producto, etc.
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- 7. RATE LIMITING (Seguridad Global para API)
-- =====================================================================
CREATE TABLE rate_limits (
  ip TEXT PRIMARY KEY,
  request_count INTEGER DEFAULT 1,
  last_request TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- HABILITAR ROW LEVEL SECURITY EN TODAS LAS TABLAS
-- =====================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- POLÍTICAS RLS MULTI-TENANT
-- Solo puedes ver/modificar datos si tu auth.uid() pertenece a esa org
-- =====================================================================

-- Organizaciones: Ver la tuya
CREATE POLICY "Users can view own organization" ON organizations 
  FOR SELECT TO authenticated 
  USING (id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- Organizaciones: Cualquier usuario autenticado puede crear una (para onboarding)
CREATE POLICY "Authenticated users can create orgs" ON organizations 
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- Team Members: CRUD de tu equipo
CREATE POLICY "Users can manage own team" ON team_members 
  FOR ALL TO authenticated 
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()))
  WITH CHECK (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- Team Members: Permitir que nuevos usuarios se inserten a sí mismos (onboarding)
CREATE POLICY "New users can insert themselves" ON team_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Leads: CRUD aislado por organización
CREATE POLICY "Users can manage own org leads" ON leads 
  FOR ALL TO authenticated 
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()))
  WITH CHECK (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- Emails: CRUD aislado por organización
CREATE POLICY "Users can manage own emails" ON emails 
  FOR ALL TO authenticated 
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()))
  WITH CHECK (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- Inventario: CRUD aislado por organización
CREATE POLICY "Users can manage own inventory" ON inventory 
  FOR ALL TO authenticated 
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()))
  WITH CHECK (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- Transacciones: CRUD aislado por organización
CREATE POLICY "Users can manage own transactions" ON transactions 
  FOR ALL TO authenticated 
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()))
  WITH CHECK (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));
