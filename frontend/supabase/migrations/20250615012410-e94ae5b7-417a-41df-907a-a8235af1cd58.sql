
-- Create enum type for activity level
CREATE TYPE public.activity_level AS ENUM ('INFO', 'WARN', 'ERROR');

-- Create the activities table
CREATE TABLE public.activities (
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    category TEXT NOT NULL,
    level public.activity_level NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Allow public access for now
CREATE POLICY "Allow public access on activities" ON public.activities FOR ALL USING (true);

-- Insert sample data into activities table
INSERT INTO public.activities (user_name, action, target, category, level, details, created_at) VALUES
('María García', 'Creó producto', 'Smartphone Galaxy S24', 'producto', 'INFO', 'Producto ''Smartphone Galaxy S24'' (SKU: SG24-BLK) creado con precio $999 y stock 100 unidades. Atributos: Color Negro, Almacenamiento 256GB.', '2024-01-15 14:30:00'),
('Juan Pérez', 'Actualizó orden', '#ORD001', 'orden', 'INFO', 'Orden #ORD001 actualizada. Estado cambiado a ''Enviado''. Dirección de envío confirmada. Items: 2. Total: $150.00.', '2024-01-15 14:25:00'),
('Ana López', 'Intentó eliminar usuario', 'admin@example.com', 'usuario', 'WARN', 'Intento fallido de eliminar al usuario ''admin@example.com''. Causa: Usuario con permisos de administrador no puede ser eliminado directamente.', '2024-01-15 14:20:00'),
('Carlos Ruiz', 'Cambió configuración', 'Email SMTP', 'configuracion', 'INFO', 'Configuración de ''Email SMTP'' actualizada. Servidor: smtp.newprovider.com, Puerto: 587. Usuario: noreply@example.com.', '2024-01-15 14:15:00'),
('Sistema', 'Error de autenticación', 'API Gateway', 'sistema', 'ERROR', 'Error crítico de autenticación (Código: 401) al intentar acceder al endpoint /v1/payment-process. IP Origen: 192.168.1.100. Token expirado o inválido.', '2024-01-15 14:10:00');
