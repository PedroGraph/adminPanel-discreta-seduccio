
-- Create enum type for order status
CREATE TYPE public.order_status AS ENUM ('Completado', 'Pendiente', 'Enviado', 'Procesando', 'Cancelado');

-- Create the orders table
CREATE TABLE public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    status public.order_status NOT NULL,
    order_date DATE NOT NULL,
    items INTEGER NOT NULL,
    address TEXT,
    phone TEXT,
    payment_method TEXT,
    tracking_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public access for now
CREATE POLICY "Allow public access on orders" ON public.orders FOR ALL USING (true);

-- Insert mock data from the application
INSERT INTO public.orders (id, customer_name, customer_email, total, status, order_date, items, address, phone, payment_method, tracking_number) VALUES
('#ORD001', 'María García', 'maria@email.com', 159.90, 'Completado', '2024-01-15', 3, 'Calle Ejemplo 123, 28001 Madrid, España', '+34 612 345 678', 'Tarjeta de Crédito **** 1234', NULL),
('#ORD002', 'Juan Pérez', 'juan@email.com', 89.50, 'Pendiente', '2024-01-15', 1, 'Avenida Principal 45, 08001 Barcelona, España', '+34 698 765 432', 'PayPal', NULL),
('#ORD003', 'Ana López', 'ana@email.com', 299.00, 'Enviado', '2024-01-14', 2, 'Plaza Mayor 6, 41001 Sevilla, España', '+34 654 321 987', 'Tarjeta de Crédito **** 5678', 'ES1234567890'),
('#ORD004', 'Carlos Ruiz', 'carlos@email.com', 45.20, 'Procesando', '2024-01-14', 1, 'Paseo de Gracia 78, 08007 Barcelona, España', '+34 611 223 344', 'Bizum', NULL),
('#ORD005', 'Laura Martín', 'laura@email.com', 678.90, 'Cancelado', '2024-01-13', 4, 'Gran Vía 12, 28013 Madrid, España', '+34 644 556 677', 'Transferencia Bancaria', NULL);
