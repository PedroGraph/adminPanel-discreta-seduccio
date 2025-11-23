
-- Create enum types for role and status to ensure data consistency
CREATE TYPE public.user_role AS ENUM ('Admin', 'Editor', 'Viewer');
CREATE TYPE public.user_status AS ENUM ('Activo', 'Inactivo');

-- Create the users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role public.user_role NOT NULL,
    status public.user_status NOT NULL,
    last_login DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public access. We can make this more secure later.
CREATE POLICY "Allow public access" ON public.users FOR ALL USING (true);

-- Insert mock data into the new users table
INSERT INTO public.users (name, email, role, status, last_login) VALUES
('María García', 'maria@email.com', 'Admin', 'Activo', '2024-01-15'),
('Juan Pérez', 'juan@email.com', 'Editor', 'Activo', '2024-01-14'),
('Ana López', 'ana@email.com', 'Viewer', 'Inactivo', '2024-01-10'),
('Carlos Ruiz', 'carlos@email.com', 'Editor', 'Activo', '2024-01-15');
