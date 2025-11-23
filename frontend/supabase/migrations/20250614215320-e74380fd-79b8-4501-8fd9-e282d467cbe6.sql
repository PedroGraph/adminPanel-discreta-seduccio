
-- Crear tabla para los cupones
CREATE TABLE public.coupons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2) DEFAULT NULL,
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER DEFAULT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_coupons_status ON public.coupons(status);
CREATE INDEX idx_coupons_type ON public.coupons(type);
CREATE INDEX idx_coupons_category ON public.coupons(category);
CREATE INDEX idx_coupons_dates ON public.coupons(start_date, end_date);

-- Habilitar Row Level Security
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos puedan leer los cupones activos
CREATE POLICY "Anyone can view active coupons" 
  ON public.coupons 
  FOR SELECT 
  USING (status = 'active' AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

-- Política para permitir que los administradores vean todos los cupones
CREATE POLICY "Admins can manage all coupons" 
  ON public.coupons 
  FOR ALL 
  USING (true);

-- Insertar algunos cupones de ejemplo
INSERT INTO public.coupons (id, name, type, value, min_order, max_discount, usage_count, usage_limit, status, start_date, end_date, category) VALUES
('SAVE20', 'Descuento 20% Electrónicos', 'percentage', 20.00, 100.00, 50.00, 45, 100, 'active', '2024-01-01', '2024-02-29', 'Electrónicos'),
('WELCOME10', 'Bienvenida Nuevos Usuarios', 'fixed', 10.00, 50.00, 10.00, 234, 500, 'active', '2024-01-01', '2024-12-31', 'General'),
('FREESHIP', 'Envío Gratis', 'free_shipping', 0.00, 75.00, 15.00, 156, 200, 'active', '2024-01-15', '2024-03-15', 'Envío'),
('EXPIRED50', 'Black Friday 50% OFF', 'percentage', 50.00, 200.00, 100.00, 87, 100, 'expired', '2023-11-24', '2023-11-27', 'Especial'),
('INACTIVE15', 'Descuento Computadoras', 'percentage', 15.00, 500.00, 75.00, 12, 50, 'inactive', '2024-02-01', '2024-02-28', 'Computadoras'),
('SUMMER25', 'Descuento Verano', 'percentage', 25.00, 150.00, 80.00, 67, 200, 'active', '2024-06-01', '2024-08-31', 'Temporada'),
('FIRSTBUY', 'Primera Compra', 'fixed', 15.00, 30.00, 15.00, 123, 300, 'active', '2024-01-01', '2024-12-31', 'Nuevos'),
('TECH30', 'Tecnología 30%', 'percentage', 30.00, 300.00, 120.00, 34, 75, 'active', '2024-05-01', '2024-07-31', 'Tecnología');
