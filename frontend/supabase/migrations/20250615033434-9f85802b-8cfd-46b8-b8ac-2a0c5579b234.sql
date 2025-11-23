
-- Crear tipos enum para las plantillas de email
CREATE TYPE public.email_template_type AS ENUM ('Marketing', 'Transaccional');
CREATE TYPE public.email_template_status AS ENUM ('Activo', 'Borrador', 'Archivado');

-- Crear la tabla email_templates
CREATE TABLE public.email_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    type public.email_template_type NOT NULL,
    status public.email_template_status NOT NULL DEFAULT 'Borrador',
    opens NUMERIC(5, 2) DEFAULT 0.00,
    clicks NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear una función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear un trigger para ejecutar la función cuando se actualiza una fila
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar Row Level Security (RLS) para la tabla
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Como no hay un sistema de autenticación, se permite el acceso público por ahora.
-- En una aplicación real, estas políticas serían más restrictivas.
CREATE POLICY "Allow public access to email templates"
ON public.email_templates
FOR ALL
USING (true)
WITH CHECK (true);

-- Insertar los datos de ejemplo en la nueva tabla
INSERT INTO public.email_templates (name, subject, body, type, status, opens, clicks, updated_at) VALUES
('Bienvenida Nuevo Usuario', '¡Bienvenido a nuestra tienda!', '<p>Hola {{name}},</p><p>Gracias por unirte a nuestra tienda. Estamos felices de tenerte con nosotros.</p>', 'Marketing', 'Activo', 89.5, 12.3, '2024-01-15T00:00:00Z'),
('Confirmación de Orden', 'Tu orden ha sido confirmada', '<p>Hola {{name}},</p><p>Tu orden #{{order_id}} ha sido confirmada y será procesada pronto.</p>', 'Transaccional', 'Activo', 95.2, 8.7, '2024-01-14T00:00:00Z'),
('Recuperar Carrito', 'No olvides completar tu compra', '<p>Hola {{name}},</p><p>Notamos que dejaste algunos artículos en tu carrito. ¡Completa tu compra ahora!</p>', 'Marketing', 'Borrador', 67.8, 15.4, '2024-01-13T00:00:00Z'),
('Envío Confirmado', 'Tu pedido está en camino', '<p>Hola {{name}},</p><p>¡Buenas noticias! Tu pedido #{{order_id}} ha sido enviado.</p>', 'Transaccional', 'Activo', 92.1, 6.8, '2024-01-12T00:00:00Z');

