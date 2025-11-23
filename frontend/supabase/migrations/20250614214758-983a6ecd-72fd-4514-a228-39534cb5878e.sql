
-- Crear tabla para las reseñas
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  product_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_verified BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_reviews_status ON public.reviews(status);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX idx_reviews_product_name ON public.reviews(product_name);

-- Habilitar Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos puedan leer las reseñas aprobadas
CREATE POLICY "Anyone can view approved reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (status = 'approved');

-- Política para permitir que los administradores vean todas las reseñas
CREATE POLICY "Admins can view all reviews" 
  ON public.reviews 
  FOR ALL 
  USING (true);

-- Insertar algunas reseñas de ejemplo
INSERT INTO public.reviews (customer_name, customer_email, product_name, rating, title, comment, status, is_verified, helpful_count) VALUES
('María García', 'maria.garcia@email.com', 'Smartphone Pro Max', 5, 'Excelente producto', 'Me encanta este teléfono, la cámara es increíble y la batería dura todo el día.', 'approved', true, 12),
('Carlos López', 'carlos.lopez@email.com', 'Laptop Gaming Elite', 4, 'Muy buena para gaming', 'Funciona perfecto para todos mis juegos, aunque se calienta un poco.', 'approved', true, 8),
('Ana Martínez', 'ana.martinez@email.com', 'Auriculares Wireless', 3, 'Sonido decente', 'El sonido está bien pero la conexión se corta a veces.', 'pending', false, 2),
('Jorge Ruiz', 'jorge.ruiz@email.com', 'Tablet Ultra', 5, 'Perfecta para trabajo', 'La uso para diseño y es perfecta, pantalla increíble.', 'approved', true, 15),
('Laura Sánchez', 'laura.sanchez@email.com', 'Smart Watch Fit', 2, 'No cumplió expectativas', 'La batería no dura lo prometido y la pantalla se ve mal al sol.', 'approved', false, 3),
('Pedro Torres', 'pedro.torres@email.com', 'Cámara Digital Pro', 4, 'Buena calidad de imagen', 'Las fotos salen muy bien, pero el menú es complicado.', 'pending', false, 1),
('Carmen Díaz', 'carmen.diaz@email.com', 'Monitor 4K Ultra', 5, 'Impresionante calidad', 'Los colores son increíbles, perfecto para edición de video.', 'approved', true, 20),
('Luis Moreno', 'luis.moreno@email.com', 'Teclado Mecánico RGB', 4, 'Muy bueno para gaming', 'Se siente muy bien al escribir, aunque es un poco ruidoso.', 'rejected', false, 0);
