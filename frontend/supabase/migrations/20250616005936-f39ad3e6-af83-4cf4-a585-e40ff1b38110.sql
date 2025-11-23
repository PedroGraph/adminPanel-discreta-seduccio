
-- Crear tabla para tickets de soporte
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('Alta', 'Media', 'Baja')),
  status TEXT NOT NULL DEFAULT 'Abierto' CHECK (status IN ('Abierto', 'En Progreso', 'Resuelto', 'Cerrado')),
  category TEXT NOT NULL,
  description TEXT,
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para proveedores
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  country TEXT,
  category TEXT NOT NULL,
  products_supplied INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  status TEXT NOT NULL DEFAULT 'Activo' CHECK (status IN ('Activo', 'Pendiente', 'Inactivo')),
  payment_terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para categorías
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Activa' CHECK (status IN ('Activa', 'Inactiva')),
  products_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_support_tickets_updated_at 
  BEFORE UPDATE ON public.support_tickets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at 
  BEFORE UPDATE ON public.suppliers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON public.categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo para tickets de soporte
INSERT INTO public.support_tickets (title, customer_name, customer_email, priority, status, category, description, assigned_to) VALUES
('Problema con el pago de mi orden', 'María García', 'maria.garcia@email.com', 'Alta', 'Abierto', 'Pagos', 'No puedo completar el pago con mi tarjeta de crédito', 'Juan Pérez'),
('Producto defectuoso recibido', 'Carlos Rodríguez', 'carlos.rodriguez@email.com', 'Media', 'En Progreso', 'Producto', 'El producto llegó con daños en el empaque', 'Ana López'),
('Consulta sobre garantía', 'Laura Martínez', 'laura.martinez@email.com', 'Baja', 'Resuelto', 'Garantía', 'Pregunta sobre la extensión de garantía', 'Juan Pérez'),
('No puedo acceder a mi cuenta', 'Pedro Sánchez', 'pedro.sanchez@email.com', 'Alta', 'Abierto', 'Cuenta', 'Olvidé mi contraseña y no recibo el email', 'Sin asignar');

-- Insertar datos de ejemplo para proveedores
INSERT INTO public.suppliers (name, contact_person, email, phone, address, country, category, products_supplied, rating, status, payment_terms) VALUES
('TechDistributors S.A.', 'Juan Pérez', 'juan@techdistributors.com', '+52 55 1234-5678', 'Av. Reforma 123, CDMX', 'México', 'Electrónicos', 45, 4.8, 'Activo', '30 días'),
('Fashion Wholesale Co.', 'María González', 'maria@fashionwholesale.com', '+52 33 9876-5432', 'Zona Industrial, Guadalajara', 'México', 'Ropa', 89, 4.5, 'Activo', '15 días'),
('Home Goods Inc.', 'Carlos Rodríguez', 'carlos@homegoods.com', '+1 555 123-4567', 'Miami, FL, USA', 'Estados Unidos', 'Hogar', 23, 3.9, 'Pendiente', '45 días'),
('Global Electronics Ltd.', 'Li Wei', 'li.wei@globalelectronics.cn', '+86 21 1234-5678', 'Shanghai, China', 'China', 'Electrónicos', 156, 4.2, 'Inactivo', '60 días');

-- Insertar datos de ejemplo para categorías
INSERT INTO public.categories (name, slug, description, parent_id, status, products_count) VALUES
('Electrónicos', 'electronicos', 'Dispositivos electrónicos y gadgets', NULL, 'Activa', 156),
('Ropa', 'ropa', 'Vestimenta para todas las edades', NULL, 'Activa', 89),
('Hogar', 'hogar', 'Artículos para el hogar', NULL, 'Inactiva', 67);

-- Insertar subcategorías
INSERT INTO public.categories (name, slug, description, parent_id, status, products_count) VALUES
('Smartphones', 'smartphones', 'Teléfonos inteligentes de todas las marcas', (SELECT id FROM public.categories WHERE slug = 'electronicos'), 'Activa', 45),
('Laptops', 'laptops', 'Computadoras portátiles', (SELECT id FROM public.categories WHERE slug = 'electronicos'), 'Activa', 32),
('Hombre', 'ropa-hombre', 'Ropa masculina', (SELECT id FROM public.categories WHERE slug = 'ropa'), 'Activa', 45),
('Mujer', 'ropa-mujer', 'Ropa femenina', (SELECT id FROM public.categories WHERE slug = 'ropa'), 'Activa', 44);
