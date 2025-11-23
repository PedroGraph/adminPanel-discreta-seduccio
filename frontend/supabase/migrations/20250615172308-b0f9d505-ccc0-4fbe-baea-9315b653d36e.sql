
-- Crear tipo ENUM para el estado del envío
CREATE TYPE public.shipment_status AS ENUM ('Preparando', 'En tránsito', 'Entregado', 'Problema');

-- Crear la tabla de envíos
CREATE TABLE public.shipments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  customer TEXT NOT NULL,
  carrier TEXT,
  tracking_number TEXT,
  status public.shipment_status NOT NULL,
  origin TEXT,
  destination TEXT,
  estimated_delivery DATE,
  cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Permitir por ahora acceso público total
CREATE POLICY "Allow public access on shipments" ON public.shipments FOR ALL USING (true);
