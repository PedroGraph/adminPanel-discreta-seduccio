
-- 1. Actualizar la seguridad de las plantillas de email
-- Se elimina el acceso público y se requiere que los usuarios estén autenticados.
DROP POLICY "Allow public access to email templates" ON public.email_templates;
CREATE POLICY "Allow authenticated users to manage email templates"
ON public.email_templates
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 2. Corregir la tabla de usuarios para integrarla con la autenticación de Supabase.
-- Esto requiere vaciar los datos de ejemplo existentes.
TRUNCATE public.users;

-- Eliminar el valor por defecto de la columna id
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;

-- Añadir la clave foránea para enlazar con los usuarios de Supabase Auth
ALTER TABLE public.users ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ajustar el tipo de dato de la columna last_login
ALTER TABLE public.users ALTER COLUMN last_login TYPE TIMESTAMPTZ USING last_login::TIMESTAMPTZ;

-- 3. Habilitar Row Level Security (RLS) en la tabla de usuarios.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver y actualizar su propio perfil.
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
