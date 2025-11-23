
-- Crear tabla de productos de inventario
CREATE TABLE public.inventory_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  max_stock INTEGER NOT NULL DEFAULT 100,
  cost NUMERIC NOT NULL DEFAULT 0,
  sell_price NUMERIC NOT NULL DEFAULT 0,
  supplier TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de movimientos de inventario
CREATE TABLE public.inventory_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.inventory_products(id) ON DELETE CASCADE NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('entrada', 'salida', 'ajuste')),
  quantity INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id TEXT,
  cost_per_unit NUMERIC,
  total_cost NUMERIC,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_inventory_products_updated_at
  BEFORE UPDATE ON public.inventory_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Función para actualizar stock automáticamente
CREATE OR REPLACE FUNCTION public.update_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar el stock del producto basado en el movimiento
  IF NEW.movement_type = 'entrada' OR NEW.movement_type = 'ajuste' THEN
    UPDATE public.inventory_products 
    SET current_stock = current_stock + NEW.quantity,
        updated_at = now()
    WHERE id = NEW.product_id;
  ELSIF NEW.movement_type = 'salida' THEN
    UPDATE public.inventory_products 
    SET current_stock = GREATEST(0, current_stock - NEW.quantity),
        updated_at = now()
    WHERE id = NEW.product_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar stock automáticamente
CREATE TRIGGER inventory_movement_update_stock
  AFTER INSERT ON public.inventory_movements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_inventory_stock();

-- Habilitar RLS
ALTER TABLE public.inventory_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para productos de inventario
CREATE POLICY "Enable read access for all users" ON public.inventory_products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.inventory_products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.inventory_products
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.inventory_products
  FOR DELETE USING (true);

-- Políticas RLS para movimientos de inventario
CREATE POLICY "Enable read access for all users" ON public.inventory_movements
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.inventory_movements
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.inventory_movements
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.inventory_movements
  FOR DELETE USING (true);

-- Insertar datos de ejemplo
INSERT INTO public.inventory_products (name, sku, current_stock, min_stock, max_stock, cost, sell_price, supplier, category) VALUES
('Smartphone Galaxy S24', 'SGS24-128-BLK', 45, 10, 100, 850, 1200, 'Samsung Electronics', 'Electrónicos'),
('Laptop Dell XPS 13', 'DXP13-512-SLV', 8, 10, 50, 1200, 1650, 'Dell Technologies', 'Computadoras'),
('Auriculares Bluetooth', 'ABT-WH1000-BLK', 120, 20, 200, 180, 299, 'Sony Music', 'Audio'),
('Reloj Inteligente', 'RIS-SE2-42-GLD', 0, 5, 30, 350, 499, 'Apple Inc.', 'Wearables');
