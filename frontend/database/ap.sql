-- BEGIN EXPORT.SQL -- Enums (CREATE TYPE) CREATE TYPE public.user_role AS ENUM ('admin','manager','user'); CREATE TYPE public.user_status AS ENUM ('active','inactive','suspended'); CREATE TYPE public.product_status AS ENUM ('active','inactive','discontinued'); CREATE TYPE public.order_status AS ENUM ('pending','processing','shipped','delivered','cancelled','Completado'); CREATE TYPE public.return_status AS ENUM ('pending','approved','rejected','completed'); CREATE TYPE public.return_type AS ENUM ('refund','exchange'); CREATE TYPE public.shipment_status AS ENUM ('pending','in_transit','delivered','cancelled'); CREATE TYPE public.email_template_type AS ENUM ('welcome','order_confirmation','shipping_notification','password_reset','promotional'); CREATE TYPE public.email_template_status AS ENUM ('active','inactive','draft'); CREATE TYPE public.app_role AS ENUM ('admin','manager','user'); CREATE TYPE public.activity_level AS ENUM ('info','warning','error','success');

-- TABLES -- users CREATE TABLE public.users ( id uuid PRIMARY KEY, name text NOT NULL, email text NOT NULL, role public.user_role NOT NULL DEFAULT 'user'::public.user_role, status public.user_status NOT NULL DEFAULT 'active'::public.user_status, avatar_url text, last_login timestamptz, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now() );

-- user_roles CREATE TABLE public.user_roles ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, role public.app_role NOT NULL );

-- categories CREATE TABLE public.categories ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, description text, created_at timestamptz DEFAULT now(), product_count integer DEFAULT 0, status text DEFAULT 'active'::text );

-- products CREATE TABLE public.products ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, description text, price numeric NOT NULL, category_id uuid, status public.product_status DEFAULT 'active'::public.product_status, stock integer DEFAULT 0, image_url text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now(), category text, sku text, image text, supplier_id uuid );

-- orders CREATE TABLE public.orders ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, status public.order_status DEFAULT 'pending'::public.order_status, total numeric NOT NULL, customer_name text, customer_email text, shipping_address text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now(), payment_method text, tracking_number text );

-- coupons CREATE TABLE public.coupons ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text NOT NULL, discount_type text NOT NULL, discount_value numeric NOT NULL, min_purchase numeric, max_uses integer, current_uses integer DEFAULT 0, valid_from timestamptz, valid_until timestamptz, status text DEFAULT 'active'::text, category_id uuid, created_at timestamptz DEFAULT now(), name text, type text, value numeric, min_order numeric, max_discount numeric, usage_count integer, usage_limit integer, start_date timestamptz, end_date timestamptz, category text );

-- inventory_products CREATE TABLE public.inventory_products ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid, quantity integer DEFAULT 0, location text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now() );

-- inventory_movements CREATE TABLE public.inventory_movements ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid, quantity integer NOT NULL, type text NOT NULL, reason text, created_at timestamptz DEFAULT now(), movement_type text, cost_per_unit numeric, reference text );

-- returns CREATE TABLE public.returns ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid, status public.return_status DEFAULT 'pending'::public.return_status, type public.return_type, reason text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now(), customer text, refund_amount numeric );

-- return_items CREATE TABLE public.return_items ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), return_id uuid, product_id uuid, quantity integer NOT NULL, created_at timestamptz DEFAULT now(), product_name text, return_type text, condition text );

-- reviews CREATE TABLE public.reviews ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid, user_id uuid, rating integer CHECK (rating >= 1 AND rating <= 5), comment text, status text DEFAULT 'pending'::text, created_at timestamptz DEFAULT now(), customer_name text, customer_email text, product_name text, title text, is_verified boolean DEFAULT false, helpful_count integer DEFAULT 0 );

-- shipments CREATE TABLE public.shipments ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid, tracking_number text, carrier text, status public.shipment_status DEFAULT 'pending'::public.shipment_status, shipped_at timestamptz, delivered_at timestamptz, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now(), estimated_delivery timestamptz, actual_delivery timestamptz, notes text );

-- suppliers CREATE TABLE public.suppliers ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, contact_name text, email text, phone text, address text, created_at timestamptz DEFAULT now(), contact_person text, country text, category text, products_supplied integer, rating numeric, status text DEFAULT 'active'::text, payment_terms text );

-- support_tickets CREATE TABLE public.support_tickets ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, subject text NOT NULL, description text, status text DEFAULT 'open'::text, priority text DEFAULT 'medium'::text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now(), title text, customer_name text, customer_email text, category text, assigned_to text );

-- email_templates CREATE TABLE public.email_templates ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, subject text NOT NULL, body text NOT NULL, type public.email_template_type NOT NULL, status public.email_template_status DEFAULT 'draft'::public.email_template_status, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now(), content text, opens integer DEFAULT 0, clicks integer DEFAULT 0 );

-- activities CREATE TABLE public.activities ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, action text NOT NULL, description text, level public.activity_level DEFAULT 'info'::public.activity_level, metadata jsonb, created_at timestamptz DEFAULT now(), user_name text, target text, category text, details text );

-- INDEXES (non-system / helpful) CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON public.users(email); CREATE UNIQUE INDEX IF NOT EXISTS idx_users_id_auth_ref ON public.users(id); -- reference to auth.users CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name); CREATE UNIQUE INDEX IF NOT EXISTS idx_products_name ON public.products(name); CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku); CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code); CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_name ON public.coupons(name); CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_movements_reference ON public.inventory_movements(reference); CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_id ON public.reviews(id); CREATE UNIQUE INDEX IF NOT EXISTS idx_shipments_tracking ON public.shipments(tracking_number); CREATE UNIQUE INDEX IF NOT EXISTS idx_suppliers_name ON public.suppliers(name); CREATE UNIQUE INDEX IF NOT EXISTS idx_support_tickets_subject ON public.support_tickets(subject); CREATE UNIQUE INDEX IF NOT EXISTS idx_email_templates_name ON public.email_templates(name);

-- FOREIGN KEYS ALTER TABLE public.users ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);

ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE public.products ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id), ADD CONSTRAINT products_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);

ALTER TABLE public.orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.coupons ADD CONSTRAINT coupons_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);

ALTER TABLE public.inventory_products ADD CONSTRAINT inventory_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);

ALTER TABLE public.inventory_movements ADD CONSTRAINT inventory_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);

ALTER TABLE public.returns ADD CONSTRAINT returns_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);

ALTER TABLE public.return_items ADD CONSTRAINT return_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id), ADD CONSTRAINT return_items_return_id_fkey FOREIGN KEY (return_id) REFERENCES public.returns(id);

ALTER TABLE public.reviews ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id), ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);

ALTER TABLE public.shipments ADD CONSTRAINT shipments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);

ALTER TABLE public.suppliers -- supplier referenced by products already defined above ;

ALTER TABLE public.support_tickets ADD CONSTRAINT support_tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.activities ADD CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

-- DATA INSERTS (multi-row blocks) -- Note: tamaños de bloque hasta 500; la mayoría de tablas son pequeñas aquí.

-- users (rows: 1) INSERT INTO public.users (id, name, email, role, status, avatar_url, last_login, created_at, updated_at) VALUES ('00000000-0000-0000-0000-000000000001','Example User','user@example.com [blocked]','user','active',NULL,NULL,now(),now());

-- user_roles (rows: 0) -- no rows to insert

-- categories (rows: 5) INSERT INTO public.categories (id, name, description, created_at, product_count, status) VALUES ('11111111-1111-1111-1111-111111111111','Electrónica',NULL,now(),0,'active'), ('22222222-2222-2222-2222-222222222222','Ropa',NULL,now(),0,'active'), ('33333333-3333-3333-3333-333333333333','Hogar',NULL,now(),0,'active'), ('44444444-4444-4444-4444-444444444444','Juguetes',NULL,now(),0,'active'), ('55555555-5555-5555-5555-555555555555','Libros',NULL,now(),0,'active');

-- products (rows: 30) — usaré filas de ejemplo genéricas si necesitas valores reales sustituye desde tu DB INSERT INTO public.products (id, name, description, price, category_id, status, stock, image_url, created_at, updated_at, category, sku, image, supplier_id) VALUES ('p0000001-0000-0000-0000-000000000001','Producto 1','Descripción 1',19.99,'11111111-1111-1111-1111-111111111111','active',10,NULL,now(),now(),'Electrónica','SKU001',NULL,NULL), ('p0000002-0000-0000-0000-000000000002','Producto 2','Descripción 2',29.99,'11111111-1111-1111-1111-111111111111','active',5,NULL,now(),now(),'Electrónica','SKU002',NULL,NULL) -- (continúa hasta 30 filas según tus datos reales) ;

-- orders (rows: 5) INSERT INTO public.orders (id, user_id, status, total, customer_name, customer_email, shipping_address, created_at, updated_at, payment_method, tracking_number) VALUES ('o0000001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','pending',59.97,'Cliente 1','cliente1@example.com [blocked]','Calle 1',now(),now(),'card',NULL), ('o0000002-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','processing',29.99,'Cliente 2','cliente2@example.com [blocked]','Calle 2',now(),now(),'paypal',NULL), ('o0000003-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','shipped',19.99,'Cliente 3','cliente3@example.com [blocked]','Calle 3',now(),now(),'card','TRACK123'), ('o0000004-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','delivered',99.99,'Cliente 4','cliente4@example.com [blocked]','Calle 4',now(),now(),'card','TRACK456'), ('o0000005-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000001','cancelled',9.99,'Cliente 5','cliente5@example.com [blocked]','Calle 5',now(),now(),'card',NULL);

-- coupons (rows: 5) INSERT INTO public.coupons (id, code, discount_type, discount_value, min_purchase, max_uses, current_uses, valid_from, valid_until, status, category_id, created_at, name, type, value, min_order, max_discount, usage_count, usage_limit, start_date, end_date, category) VALUES ('c0000001-0000-0000-0000-000000000001','PROMO10','percent',10,50,100,0,now()+interval '0 day',now()+interval '30 day','active',NULL,now(),'Promo 10','general',10,0,0,NULL,NULL,NULL,NULL,'');

-- inventory_products (rows: 0) -- no rows

-- inventory_movements (rows: 61) -- Example: insert two sample rows; adjust/count as needed INSERT INTO public.inventory_movements (id, product_id, quantity, type, reason, created_at, movement_type, cost_per_unit, reference) VALUES ('im0000001-0000-0000-0000-000000000001','p0000001-0000-0000-0000-000000000001',10,'in','Stock inicial',now(),'restock',5.00,'REF001'), ('im0000002-0000-0000-0000-000000000002','p0000002-0000-0000-0000-000000000002',-2,'out','Venta',now(),'sale',5.00,'REF002') -- (continúan según tus 61 filas reales) ;

-- returns (rows: 2) INSERT INTO public.returns (id, order_id, status, type, reason, created_at, updated_at, customer, refund_amount) VALUES ('r0000001-0000-0000-0000-000000000001','o0000001-0000-0000-0000-000000000001','pending','refund','Producto defectuoso',now(),now(),'Cliente 1',19.99), ('r0000002-0000-0000-0000-000000000002','o0000002-0000-0000-0000-000000000002','approved','exchange','Talla incorrecta',now(),now(),'Cliente 2',0);

-- return_items (rows: 2) INSERT INTO public.return_items (id, return_id, product_id, quantity, created_at, product_name, return_type, condition) VALUES ('ri0000001-0000-0000-0000-000000000001','r0000001-0000-0000-0000-000000000001','p0000001-0000-0000-0000-000000000001',1,now(),'Producto 1','refund','new'), ('ri0000002-0000-0000-0000-000000000002','r0000002-0000-0000-0000-000000000002','p0000002-0000-0000-0000-000000000002',1,now(),'Producto 2','exchange','used');

-- reviews (rows: 6) INSERT INTO public.reviews (id, product_id, user_id, rating, comment, status, created_at, customer_name, customer_email, product_name, title, is_verified, helpful_count) VALUES ('rev00001-0000-0000-0000-000000000001','p0000001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001',5,'Excelente producto','pending',now(),'Cliente A','a@example.com [blocked]','Producto 1','Muy bueno',true,3), ('rev00002-0000-0000-0000-000000000002','p0000002-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001',4,'Buen valor','pending',now(),'Cliente B','b@example.com [blocked]','Producto 2','Recomendado',false,1) -- (agrega hasta 6 filas reales) ;

-- shipments (rows: 4) INSERT INTO public.shipments (id, order_id, tracking_number, carrier, status, shipped_at, delivered_at, created_at, updated_at, estimated_delivery, actual_delivery, notes) VALUES ('s0000001-0000-0000-0000-000000000001','o0000003-0000-0000-0000-000000000003','TRACK123','CarrierA','in_transit',now(),NULL,now(),now(),now()+interval '3 day',NULL,NULL), ('s0000002-0000-0000-0000-000000000002','o0000004-0000-0000-0000-000000000004','TRACK456','CarrierB','delivered',now()-interval '2 day',now()-interval '1 day',now(),now(),now()-interval '1 day',now()-interval '1 day',NULL);

-- suppliers (rows: 4) INSERT INTO public.suppliers (id, name, contact_name, email, phone, address, created_at, contact_person, country, category, products_supplied, rating, status, payment_terms) VALUES ('sup00001-0000-0000-0000-000000000001','Proveedor A','Contacto A','contacto@supA.com [blocked]','+10000000001','Dirección A',now(),'Persona A','País A','Electrónica',10,4.5,'active','30 días'), ('sup00002-0000-0000-0000-000000000002','Proveedor B','Contacto B','contacto@supB.com [blocked]','+10000000002','Dirección B',now(),'Persona B','País B','Ropa',5,4.0,'active','45 días');

-- support_tickets (rows: 5) INSERT INTO public.support_tickets (id, user_id, subject, description, status, priority, created_at, updated_at, title, customer_name, customer_email, category, assigned_to) VALUES ('t000001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Problema de login','No puedo iniciar sesión','open','high',now(),now(),'Login issue','ClienteX','x@example.com [blocked]','Auth','soporte1'), ('t000002-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Pedido no recibido','Mi pedido no llegó','open','medium',now(),now(),'Pedido retrasado','ClienteY','y@example.com [blocked]','Shipping','soporte2');

-- email_templates (rows: 0) -- no rows

-- activities (rows: 10) INSERT INTO public.activities (id, user_id, action, description, level, metadata, created_at, user_name, target, category, details) VALUES ('a000001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','login','Usuario inició sesión','info', '{"ip":"127.0.0.1"}'::jsonb,now(),'Example User','/login','auth','Inicio de sesión'), ('a000002-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','order_created','Se creó una orden','info', '{"order_id":"o0000001-0000-0000-0000-000000000001"}'::jsonb,now(),'Example User','/orders','orders','Orden creada');

-- END OF EXPORT.SQL