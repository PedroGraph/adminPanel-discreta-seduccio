
-- Create enum type for product status
CREATE TYPE public.product_status AS ENUM ('Activo', 'Inactivo', 'Agotado');

-- Create the products table
CREATE TABLE public.products (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    stock INTEGER NOT NULL DEFAULT 0,
    status public.product_status NOT NULL DEFAULT 'Activo',
    image TEXT,
    description TEXT,
    sku TEXT,
    date_added DATE,
    sales INTEGER,
    rating NUMERIC(2,1),
    reviews INTEGER,
    tags TEXT[],
    variants JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access. We can make these more secure later.
CREATE POLICY "Allow public access" ON public.products FOR ALL USING (true);

-- Insert mock data from the application into the new products table
INSERT INTO public.products (name, slug, category, price, original_price, stock, status, image, description, sku, date_added, sales, rating, reviews, tags, variants) VALUES
('Smartphone Galaxy S24', 'smartphone-galaxy-s24', 'Electrónicos', 899.99, 999.99, 45, 'Activo', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'Smartphone de última generación con cámara profesional y rendimiento excepcional. Perfecto para usuarios profesionales y entusiastas de la tecnología.', 'WH-PRO-1001', '2023-05-15', 1245, 4.8, 124, '{"smartphone", "galaxy", "premium"}', '{"color": ["Black", "White", "Silver"], "connectivity": ["5G", "4G LTE"]}'),
('Laptop Dell XPS 13', 'laptop-dell-xps-13', 'Computadoras', 1299.99, 1499.99, 12, 'Activo', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 'Laptop ultrabook con procesador Intel de última generación y diseño premium. Ideal para profesionales y estudiantes.', 'DL-XPS-2001', '2023-04-20', 856, 4.6, 89, '{"laptop", "dell", "ultrabook"}', '{"color": ["Silver", "Black"], "connectivity": ["Wi-Fi 6", "Bluetooth 5.2"]}'),
('Auriculares Bluetooth', 'auriculares-bluetooth', 'Audio', 199.99, 249.99, 0, 'Agotado', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Auriculares inalámbricos de alta calidad con cancelación de ruido y sonido premium. Perfectos para amantes de la música y profesionales.', 'WH-PRO-1001', '2023-05-15', 1245, 4.8, 124, '{"wireless", "headphones", "audio", "premium"}', '{"color": ["Black", "White", "Silver"], "connectivity": ["Bluetooth 5.0", "Bluetooth 5.2"]}'),
('Reloj Inteligente', 'reloj-inteligente', 'Wearables', 299.99, 349.99, 8, 'Inactivo', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'Reloj inteligente con monitoreo de salud y conectividad avanzada. Perfecto para un estilo de vida activo.', 'SW-PRO-3001', '2023-03-10', 567, 4.5, 78, '{"smartwatch", "fitness", "health"}', '{"color": ["Black", "Silver", "Gold"], "connectivity": ["Bluetooth", "Wi-Fi"]}');
