
-- Create enum type for return status
CREATE TYPE public.return_status AS ENUM ('Aprobado', 'Pendiente', 'Rechazado', 'Procesando');

-- Create enum type for return type
CREATE TYPE public.return_type AS ENUM ('Reembolso', 'Intercambio');

-- Create the returns table
CREATE TABLE public.returns (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id),
    customer TEXT NOT NULL,
    status public.return_status NOT NULL,
    request_date DATE NOT NULL,
    total_refund_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
-- Allow public access for now
CREATE POLICY "Allow public access on returns" ON public.returns FOR ALL USING (true);


-- Create the return_items table
CREATE TABLE public.return_items (
    id SERIAL PRIMARY KEY,
    return_id TEXT NOT NULL REFERENCES public.returns(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    quantity_to_return INTEGER NOT NULL,
    reason TEXT NOT NULL,
    return_type public.return_type NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;
-- Allow public access for now
CREATE POLICY "Allow public access on return_items" ON public.return_items FOR ALL USING (true);

-- Insert data into returns table
INSERT INTO public.returns (id, order_id, customer, status, request_date, total_refund_amount) VALUES
('#RET001', '#ORD001', 'María García', 'Aprobado', '2024-01-10', 1199.98),
('#RET002', '#ORD003', 'Ana López', 'Pendiente', '2024-01-12', 199.99),
('#RET003', '#ORD005', 'Carlos Ruiz', 'Rechazado', '2024-01-14', 299.99),
('#RET004', '#ORD002', 'Juan Pérez', 'Procesando', '2024-01-15', 1799.98);

-- Insert data into return_items table
INSERT INTO public.return_items (return_id, product_id, product_name, quantity, quantity_to_return, reason, return_type, unit_price, total_price) VALUES
-- Items for #RET001
('#RET001', 'P001', 'Smartphone Galaxy S24', 2, 1, 'Defecto de fábrica', 'Reembolso', 899.99, 899.99),
('#RET001', 'P002', 'Funda Protectora', 2, 2, 'No me gusta', 'Reembolso', 149.99, 299.99),

-- Items for #RET002
('#RET002', 'P003', 'Auriculares Bluetooth', 1, 1, 'No funciona correctamente', 'Intercambio', 199.99, 199.99),

-- Items for #RET003
('#RET003', 'P004', 'Reloj Inteligente', 1, 1, 'No me gusta', 'Reembolso', 299.99, 299.99),

-- Items for #RET004
('#RET004', 'P005', 'Laptop Dell XPS 13', 1, 1, 'Artículo dañado en envío', 'Intercambio', 1299.99, 1299.99),
('#RET004', 'P006', 'Mouse Inalámbrico', 2, 1, 'Defecto de fábrica', 'Reembolso', 49.99, 49.99),
('#RET004', 'P007', 'Teclado Mecánico', 1, 1, 'No funciona correctamente', 'Reembolso', 149.99, 149.99);
