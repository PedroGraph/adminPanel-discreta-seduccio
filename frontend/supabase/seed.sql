-- Script de datos de prueba para todas las tablas
-- Ejecutar este script en el SQL Editor de Supabase

-- Insertar categorías
INSERT INTO categories (name, description, product_count, status) VALUES
('Electrónica', 'Dispositivos y gadgets electrónicos', 0, 'active'),
('Ropa', 'Prendas de vestir y accesorios', 0, 'active'),
('Hogar', 'Artículos para el hogar', 0, 'active'),
('Deportes', 'Equipamiento deportivo', 0, 'active'),
('Libros', 'Libros y material de lectura', 0, 'active')
ON CONFLICT (name) DO NOTHING;

-- Insertar proveedores
INSERT INTO suppliers (name, contact_person, email, phone, address, country, category, products_supplied, rating, status, payment_terms) VALUES
('TechSupply Co.', 'Juan Pérez', 'juan@techsupply.com', '+34 612345678', 'Calle Principal 123', 'España', 'Electrónica', 15, 4.5, 'active', '30 días'),
('Fashion World', 'María García', 'maria@fashionworld.com', '+34 698765432', 'Avenida Moda 456', 'España', 'Ropa', 25, 4.8, 'active', '15 días'),
('Home Essentials', 'Carlos López', 'carlos@homeessentials.com', '+34 687654321', 'Plaza Hogar 789', 'España', 'Hogar', 20, 4.2, 'active', '45 días'),
('Sports Pro', 'Elena Ruiz', 'elena@sportspro.com', '+34 655443322', 'Calle Deporte 15', 'España', 'Deportes', 18, 4.6, 'active', '30 días')
ON CONFLICT (email) DO NOTHING;

-- Insertar productos
INSERT INTO products (name, description, category, price, stock, sku, status, image, supplier_id) VALUES
-- Electrónica
('Laptop HP 15"', 'Laptop moderna con procesador Intel i5, 8GB RAM, 256GB SSD', 'Electrónica', 699.99, 25, 'TECH-LAP-001', 'active', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', (SELECT id FROM suppliers WHERE name = 'TechSupply Co.' LIMIT 1)),
('Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido', 'Electrónica', 89.99, 50, 'TECH-AUD-002', 'active', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', (SELECT id FROM suppliers WHERE name = 'TechSupply Co.' LIMIT 1)),
('Mouse Gaming RGB', 'Mouse ergonómico con iluminación RGB', 'Electrónica', 45.99, 80, 'TECH-MOU-003', 'active', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', (SELECT id FROM suppliers WHERE name = 'TechSupply Co.' LIMIT 1)),
('Teclado Mecánico', 'Teclado mecánico retroiluminado RGB', 'Electrónica', 129.99, 35, 'TECH-TEC-004', 'active', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', (SELECT id FROM suppliers WHERE name = 'TechSupply Co.' LIMIT 1)),
('Webcam HD', 'Cámara web 1080p con micrófono integrado', 'Electrónica', 59.99, 45, 'TECH-WEB-005', 'active', 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=400', (SELECT id FROM suppliers WHERE name = 'TechSupply Co.' LIMIT 1)),
('Monitor 24"', 'Monitor Full HD IPS de 24 pulgadas', 'Electrónica', 199.99, 20, 'TECH-MON-006', 'active', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', (SELECT id FROM suppliers WHERE name = 'TechSupply Co.' LIMIT 1)),
('Tablet Android', 'Tablet 10" con 64GB de almacenamiento', 'Electrónica', 249.99, 30, 'TECH-TAB-007', 'active', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', (SELECT id FROM suppliers WHERE name = 'TechSupply Co.' LIMIT 1)),
('Smartwatch', 'Reloj inteligente con monitor de salud', 'Electrónica', 179.99, 40, 'TECH-WAT-008', 'active', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', (SELECT id FROM suppliers WHERE name = 'TechSupply Co.' LIMIT 1)),
-- Ropa
('Camiseta Deportiva', 'Camiseta transpirable para deporte', 'Ropa', 24.99, 100, 'ROPA-CAM-001', 'active', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', (SELECT id FROM suppliers WHERE name = 'Fashion World' LIMIT 1)),
('Jeans Classic', 'Pantalones vaqueros de corte clásico', 'Ropa', 49.99, 75, 'ROPA-JEA-002', 'active', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', (SELECT id FROM suppliers WHERE name = 'Fashion World' LIMIT 1)),
('Chaqueta Impermeable', 'Chaqueta ligera resistente al agua', 'Ropa', 89.99, 50, 'ROPA-CHA-003', 'active', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', (SELECT id FROM suppliers WHERE name = 'Fashion World' LIMIT 1)),
('Sudadera con Capucha', 'Sudadera de algodón con capucha', 'Ropa', 39.99, 85, 'ROPA-SUD-004', 'active', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', (SELECT id FROM suppliers WHERE name = 'Fashion World' LIMIT 1)),
('Vestido Casual', 'Vestido cómodo para uso diario', 'Ropa', 54.99, 60, 'ROPA-VES-005', 'active', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', (SELECT id FROM suppliers WHERE name = 'Fashion World' LIMIT 1)),
('Pantalones Cargo', 'Pantalones cargo con múltiples bolsillos', 'Ropa', 44.99, 70, 'ROPA-PAN-006', 'active', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400', (SELECT id FROM suppliers WHERE name = 'Fashion World' LIMIT 1)),
-- Hogar
('Lámpara LED', 'Lámpara de escritorio LED ajustable', 'Hogar', 34.99, 40, 'HOGA-LAM-001', 'active', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', (SELECT id FROM suppliers WHERE name = 'Home Essentials' LIMIT 1)),
('Set de Toallas', 'Juego de 3 toallas de algodón', 'Hogar', 29.99, 60, 'HOGA-TOA-002', 'active', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400', (SELECT id FROM suppliers WHERE name = 'Home Essentials' LIMIT 1)),
('Juego de Sábanas', 'Sábanas de algodón egipcio para cama doble', 'Hogar', 59.99, 45, 'HOGA-SAB-003', 'active', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', (SELECT id FROM suppliers WHERE name = 'Home Essentials' LIMIT 1)),
('Almohadas Memory Foam', 'Pack de 2 almohadas viscoelásticas', 'Hogar', 49.99, 55, 'HOGA-ALM-004', 'active', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', (SELECT id FROM suppliers WHERE name = 'Home Essentials' LIMIT 1)),
('Espejo Decorativo', 'Espejo de pared con marco dorado', 'Hogar', 69.99, 25, 'HOGA-ESP-005', 'active', 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400', (SELECT id FROM suppliers WHERE name = 'Home Essentials' LIMIT 1)),
('Organizador de Cocina', 'Set de organizadores para cajones', 'Hogar', 24.99, 80, 'HOGA-ORG-006', 'active', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400', (SELECT id FROM suppliers WHERE name = 'Home Essentials' LIMIT 1)),
-- Deportes
('Zapatillas Running', 'Zapatillas ligeras para correr', 'Deportes', 79.99, 60, 'DEPO-ZAP-001', 'active', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', (SELECT id FROM suppliers WHERE name = 'Sports Pro' LIMIT 1)),
('Esterilla de Yoga', 'Esterilla antideslizante de 6mm', 'Deportes', 29.99, 90, 'DEPO-EST-002', 'active', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', (SELECT id FROM suppliers WHERE name = 'Sports Pro' LIMIT 1)),
('Pesas Ajustables', 'Set de mancuernas ajustables 2-10kg', 'Deportes', 119.99, 35, 'DEPO-PES-003', 'active', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', (SELECT id FROM suppliers WHERE name = 'Sports Pro' LIMIT 1)),
('Balón de Fútbol', 'Balón profesional talla 5', 'Deportes', 34.99, 70, 'DEPO-BAL-004', 'active', 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400', (SELECT id FROM suppliers WHERE name = 'Sports Pro' LIMIT 1)),
('Bicicleta Estática', 'Bicicleta de ejercicio con monitor LCD', 'Deportes', 299.99, 15, 'DEPO-BIC-005', 'active', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400', (SELECT id FROM suppliers WHERE name = 'Sports Pro' LIMIT 1)),
('Botella Deportiva', 'Botella de agua térmica 750ml', 'Deportes', 19.99, 120, 'DEPO-BOT-006', 'active', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', (SELECT id FROM suppliers WHERE name = 'Sports Pro' LIMIT 1)),
-- Libros
('Guía de Programación', 'Libro completo sobre desarrollo web moderno', 'Libros', 39.99, 50, 'LIBR-PRO-001', 'active', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', (SELECT id FROM suppliers WHERE name = 'TechSupply Co.' LIMIT 1)),
('Novela de Aventuras', 'Bestseller internacional de ficción', 'Libros', 24.99, 65, 'LIBR-NOV-002', 'active', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', (SELECT id FROM suppliers WHERE name = 'Fashion World' LIMIT 1)),
('Manual de Cocina', 'Recetas saludables y fáciles', 'Libros', 29.99, 40, 'LIBR-COC-003', 'active', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', (SELECT id FROM suppliers WHERE name = 'Home Essentials' LIMIT 1)),
('Libro de Fitness', 'Guía completa de entrenamiento', 'Libros', 34.99, 45, 'LIBR-FIT-004', 'active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', (SELECT id FROM suppliers WHERE name = 'Sports Pro' LIMIT 1))
ON CONFLICT (sku) DO NOTHING;

-- Actualizar product_count en categorías
UPDATE categories SET product_count = (SELECT COUNT(*) FROM products WHERE category = 'Electrónica') WHERE name = 'Electrónica';
UPDATE categories SET product_count = (SELECT COUNT(*) FROM products WHERE category = 'Ropa') WHERE name = 'Ropa';
UPDATE categories SET product_count = (SELECT COUNT(*) FROM products WHERE category = 'Hogar') WHERE name = 'Hogar';
UPDATE categories SET product_count = (SELECT COUNT(*) FROM products WHERE category = 'Deportes') WHERE name = 'Deportes';

-- Insertar órdenes
INSERT INTO orders (customer_name, customer_email, total, status, payment_method, shipping_address, tracking_number, created_at) VALUES
('Ana Martínez', 'ana.martinez@email.com', 789.98, 'Completado', 'Tarjeta de crédito', 'Calle Luna 45, 28001 Madrid', 'TRACK-2024-001', NOW() - INTERVAL '5 days'),
('Pedro Sánchez', 'pedro.sanchez@email.com', 74.98, 'En tránsito', 'PayPal', 'Avenida Sol 12, 08001 Barcelona', 'TRACK-2024-002', NOW() - INTERVAL '2 days'),
('Laura Rodríguez', 'laura.rodriguez@email.com', 109.97, 'Pendiente', 'Transferencia', 'Plaza Mayor 8, 46001 Valencia', NULL, NOW() - INTERVAL '1 day'),
('Miguel Torres', 'miguel.torres@email.com', 124.97, 'Completado', 'Tarjeta de crédito', 'Calle Estrella 33, 41001 Sevilla', 'TRACK-2024-003', NOW() - INTERVAL '10 days'),
('Carmen Díaz', 'carmen.diaz@email.com', 159.97, 'En tránsito', 'Tarjeta de débito', 'Avenida Libertad 78, 29001 Málaga', 'TRACK-2024-004', NOW() - INTERVAL '1 day');

-- Insertar cupones
INSERT INTO coupons (name, type, value, min_order, max_discount, usage_count, usage_limit, status, start_date, end_date, category) VALUES
('VERANO2024', 'percentage', 15, 50, 30, 45, 100, 'active', NOW() - INTERVAL '30 days', NOW() + INTERVAL '60 days', 'Ropa'),
('ENVIOGRATIS', 'free_shipping', 0, 30, NULL, 120, 500, 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '90 days', NULL),
('DESCUENTO10', 'fixed', 10, 20, NULL, 80, 200, 'active', NOW() - INTERVAL '20 days', NOW() + INTERVAL '40 days', NULL),
('BLACKFRIDAY', 'percentage', 30, 100, 50, 0, 1000, 'inactive', NOW() + INTERVAL '60 days', NOW() + INTERVAL '90 days', NULL),
('TECNOLOGIA20', 'percentage', 20, 100, 100, 15, 50, 'active', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days', 'Electrónica')
ON CONFLICT (name) DO NOTHING;

-- Insertar reseñas
INSERT INTO reviews (customer_name, customer_email, product_name, rating, title, comment, status, is_verified, helpful_count, created_at) VALUES
('Ana Martínez', 'ana.martinez@email.com', 'Laptop HP 15"', 5, 'Excelente producto', 'La laptop funciona perfectamente, muy rápida y buena calidad. La recomiendo totalmente.', 'approved', true, 12, NOW() - INTERVAL '5 days'),
('Pedro Sánchez', 'pedro.sanchez@email.com', 'Auriculares Bluetooth', 4, 'Muy buenos', 'Buena calidad de sonido, aunque la batería podría durar más. Por el precio están geniales.', 'approved', true, 8, NOW() - INTERVAL '3 days'),
('Laura Rodríguez', 'laura.rodriguez@email.com', 'Camiseta Deportiva', 5, 'Perfecta para correr', 'Material muy cómodo y transpirable. Ideal para entrenar.', 'approved', true, 5, NOW() - INTERVAL '2 days'),
('Miguel Torres', 'miguel.torres@email.com', 'Jeans Classic', 3, 'Aceptables', 'La talla no corresponde exactamente con lo indicado. Material bueno pero talla pequeña.', 'pending', false, 2, NOW() - INTERVAL '1 day'),
('Carmen Díaz', 'carmen.diaz@email.com', 'Zapatillas Running', 5, 'Las mejores que he tenido', 'Muy cómodas y ligeras. Perfectas para correr largas distancias.', 'approved', true, 18, NOW() - INTERVAL '8 days'),
('Juan García', 'juan.garcia@email.com', 'Mouse Gaming RGB', 4, 'Buen mouse gaming', 'Responde muy bien, las luces RGB son geniales. Un poco caro pero vale la pena.', 'approved', true, 6, NOW() - INTERVAL '4 days');

-- Insertar tickets de soporte
INSERT INTO support_tickets (title, customer_name, customer_email, priority, status, category, description, assigned_to, created_at) VALUES
('Problema con el envío', 'Ana Martínez', 'ana.martinez@email.com', 'high', 'open', 'shipping', 'Mi pedido no ha llegado en la fecha estimada. Según el tracking debería haber llegado ayer.', NULL, NOW() - INTERVAL '2 days'),
('Consulta sobre devolución', 'Pedro Sánchez', 'pedro.sanchez@email.com', 'medium', 'in_progress', 'returns', 'Quiero saber cómo proceder con una devolución. El producto no es lo que esperaba.', 'admin', NOW() - INTERVAL '1 day'),
('Error en la factura', 'Laura Rodríguez', 'laura.rodriguez@email.com', 'low', 'resolved', 'billing', 'La factura tiene un error en el total. Me cobraron más de lo que indica el carrito.', 'admin', NOW() - INTERVAL '5 days'),
('Producto defectuoso', 'Miguel Torres', 'miguel.torres@email.com', 'high', 'open', 'product', 'El producto llegó con un defecto de fábrica. Necesito cambio urgente.', NULL, NOW() - INTERVAL '3 hours'),
('Pregunta sobre garantía', 'Carmen Díaz', 'carmen.diaz@email.com', 'low', 'open', 'general', '¿Cuánto tiempo de garantía tienen los productos electrónicos?', NULL, NOW() - INTERVAL '6 hours');

-- Insertar envíos
INSERT INTO shipments (order_id, tracking_number, carrier, status, estimated_delivery, actual_delivery, notes) VALUES
((SELECT id FROM orders WHERE customer_name = 'Ana Martínez' ORDER BY created_at DESC LIMIT 1), 'TRACK-2024-001', 'DHL', 'delivered', NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days', 'Entregado sin problemas. Cliente satisfecho.'),
((SELECT id FROM orders WHERE customer_name = 'Pedro Sánchez' ORDER BY created_at DESC LIMIT 1), 'TRACK-2024-002', 'Correos', 'in_transit', NOW() + INTERVAL '1 day', NULL, 'En camino al destino. Última actualización: En centro de distribución.'),
((SELECT id FROM orders WHERE customer_name = 'Miguel Torres' ORDER BY created_at DESC LIMIT 1), 'TRACK-2024-003', 'SEUR', 'delivered', NOW() - INTERVAL '7 days', NOW() - INTERVAL '8 days', 'Entrega confirmada por el cliente.'),
((SELECT id FROM orders WHERE customer_name = 'Carmen Díaz' ORDER BY created_at DESC LIMIT 1), 'TRACK-2024-004', 'MRW', 'in_transit', NOW() + INTERVAL '2 days', NULL, 'Paquete en tránsito. Esperado para mañana.');

-- Insertar plantillas de email
INSERT INTO email_templates (name, subject, content, type, status, opens, clicks, created_at) VALUES
('Bienvenida', 'Bienvenido a nuestra tienda', '<h1>¡Hola!</h1><p>Gracias por registrarte en nuestra tienda. Estamos encantados de tenerte con nosotros.</p><p>Explora nuestro catálogo y disfruta de nuestras ofertas especiales.</p>', 'transactional', 'active', 150, 45, NOW() - INTERVAL '30 days'),
('Confirmación de pedido', 'Tu pedido ha sido confirmado', '<h1>Pedido confirmado</h1><p>Gracias por tu compra. Tu pedido está siendo procesado.</p><p>Recibirás un email cuando sea enviado.</p>', 'transactional', 'active', 320, 280, NOW() - INTERVAL '25 days'),
('Newsletter mensual', 'Novedades del mes', '<h1>Este mes en nuestra tienda</h1><p>Descubre las últimas novedades y ofertas exclusivas.</p><p>¡No te las pierdas!</p>', 'marketing', 'active', 500, 120, NOW() - INTERVAL '15 days'),
('Recuperar carrito', 'Olvidaste algo en tu carrito', '<h1>Tu carrito te espera</h1><p>Completa tu compra ahora y consigue envío gratis en pedidos superiores a 50€.</p>', 'marketing', 'draft', 0, 0, NOW() - INTERVAL '5 days'),
('Envío realizado', 'Tu pedido está en camino', '<h1>¡Buenas noticias!</h1><p>Tu pedido ha sido enviado. Puedes seguirlo con el número de tracking.</p>', 'transactional', 'active', 280, 240, NOW() - INTERVAL '20 days')
ON CONFLICT (name) DO NOTHING;

-- Insertar movimientos de inventario
INSERT INTO inventory_movements (product_id, movement_type, quantity, reason, cost_per_unit, reference, created_at) VALUES
-- Movimientos de Electrónica
((SELECT id FROM products WHERE sku = 'TECH-LAP-001' LIMIT 1), 'in', 30, 'Recepción de proveedor', 550.00, 'PO-2024-001', NOW() - INTERVAL '15 days'),
((SELECT id FROM products WHERE sku = 'TECH-LAP-001' LIMIT 1), 'out', 5, 'Venta', 699.99, 'ORD-2024-001', NOW() - INTERVAL '5 days'),
((SELECT id FROM products WHERE sku = 'TECH-AUD-002' LIMIT 1), 'in', 60, 'Recepción de proveedor', 65.00, 'PO-2024-002', NOW() - INTERVAL '12 days'),
((SELECT id FROM products WHERE sku = 'TECH-AUD-002' LIMIT 1), 'out', 10, 'Venta', 89.99, 'ORD-2024-002', NOW() - INTERVAL '3 days'),
((SELECT id FROM products WHERE sku = 'TECH-MOU-003' LIMIT 1), 'in', 100, 'Recepción de proveedor', 30.00, 'PO-2024-005', NOW() - INTERVAL '25 days'),
((SELECT id FROM products WHERE sku = 'TECH-MOU-003' LIMIT 1), 'out', 20, 'Venta', 45.99, 'ORD-2024-004', NOW() - INTERVAL '10 days'),
((SELECT id FROM products WHERE sku = 'TECH-TEC-004' LIMIT 1), 'in', 50, 'Recepción de proveedor', 95.00, 'PO-2024-006', NOW() - INTERVAL '20 days'),
((SELECT id FROM products WHERE sku = 'TECH-TEC-004' LIMIT 1), 'out', 15, 'Venta', 129.99, 'ORD-2024-005', NOW() - INTERVAL '6 days'),
((SELECT id FROM products WHERE sku = 'TECH-WEB-005' LIMIT 1), 'in', 60, 'Recepción de proveedor', 42.00, 'PO-2024-007', NOW() - INTERVAL '18 days'),
((SELECT id FROM products WHERE sku = 'TECH-WEB-005' LIMIT 1), 'out', 15, 'Venta', 59.99, 'ORD-2024-006', NOW() - INTERVAL '4 days'),
((SELECT id FROM products WHERE sku = 'TECH-MON-006' LIMIT 1), 'in', 25, 'Recepción de proveedor', 145.00, 'PO-2024-008', NOW() - INTERVAL '30 days'),
((SELECT id FROM products WHERE sku = 'TECH-MON-006' LIMIT 1), 'out', 5, 'Venta', 199.99, 'ORD-2024-007', NOW() - INTERVAL '12 days'),
((SELECT id FROM products WHERE sku = 'TECH-TAB-007' LIMIT 1), 'in', 40, 'Recepción de proveedor', 180.00, 'PO-2024-009', NOW() - INTERVAL '22 days'),
((SELECT id FROM products WHERE sku = 'TECH-TAB-007' LIMIT 1), 'out', 10, 'Venta', 249.99, 'ORD-2024-008', NOW() - INTERVAL '8 days'),
((SELECT id FROM products WHERE sku = 'TECH-WAT-008' LIMIT 1), 'in', 50, 'Recepción de proveedor', 125.00, 'PO-2024-010', NOW() - INTERVAL '28 days'),
((SELECT id FROM products WHERE sku = 'TECH-WAT-008' LIMIT 1), 'out', 10, 'Venta', 179.99, 'ORD-2024-009', NOW() - INTERVAL '9 days'),
-- Movimientos de Ropa
((SELECT id FROM products WHERE sku = 'ROPA-CAM-001' LIMIT 1), 'in', 150, 'Recepción de proveedor', 15.00, 'PO-2024-011', NOW() - INTERVAL '35 days'),
((SELECT id FROM products WHERE sku = 'ROPA-CAM-001' LIMIT 1), 'out', 50, 'Venta', 24.99, 'ORD-2024-010', NOW() - INTERVAL '15 days'),
((SELECT id FROM products WHERE sku = 'ROPA-CAM-001' LIMIT 1), 'adjustment', -5, 'Ajuste de inventario - productos dañados', 0, 'ADJ-2024-001', NOW() - INTERVAL '7 days'),
((SELECT id FROM products WHERE sku = 'ROPA-JEA-002' LIMIT 1), 'in', 100, 'Recepción de proveedor', 35.00, 'PO-2024-012', NOW() - INTERVAL '20 days'),
((SELECT id FROM products WHERE sku = 'ROPA-JEA-002' LIMIT 1), 'out', 25, 'Venta', 49.99, 'ORD-2024-011', NOW() - INTERVAL '11 days'),
((SELECT id FROM products WHERE sku = 'ROPA-CHA-003' LIMIT 1), 'in', 70, 'Recepción de proveedor', 62.00, 'PO-2024-013', NOW() - INTERVAL '26 days'),
((SELECT id FROM products WHERE sku = 'ROPA-CHA-003' LIMIT 1), 'out', 20, 'Venta', 89.99, 'ORD-2024-012', NOW() - INTERVAL '13 days'),
((SELECT id FROM products WHERE sku = 'ROPA-SUD-004' LIMIT 1), 'in', 120, 'Recepción de proveedor', 25.00, 'PO-2024-014', NOW() - INTERVAL '32 days'),
((SELECT id FROM products WHERE sku = 'ROPA-SUD-004' LIMIT 1), 'out', 35, 'Venta', 39.99, 'ORD-2024-013', NOW() - INTERVAL '14 days'),
((SELECT id FROM products WHERE sku = 'ROPA-VES-005' LIMIT 1), 'in', 80, 'Recepción de proveedor', 38.00, 'PO-2024-015', NOW() - INTERVAL '24 days'),
((SELECT id FROM products WHERE sku = 'ROPA-VES-005' LIMIT 1), 'out', 20, 'Venta', 54.99, 'ORD-2024-014', NOW() - INTERVAL '16 days'),
((SELECT id FROM products WHERE sku = 'ROPA-PAN-006' LIMIT 1), 'in', 90, 'Recepción de proveedor', 30.00, 'PO-2024-016', NOW() - INTERVAL '27 days'),
((SELECT id FROM products WHERE sku = 'ROPA-PAN-006' LIMIT 1), 'out', 20, 'Venta', 44.99, 'ORD-2024-015', NOW() - INTERVAL '17 days'),
-- Movimientos de Hogar
((SELECT id FROM products WHERE sku = 'HOGA-LAM-001' LIMIT 1), 'in', 60, 'Recepción de proveedor', 22.00, 'PO-2024-017', NOW() - INTERVAL '29 days'),
((SELECT id FROM products WHERE sku = 'HOGA-LAM-001' LIMIT 1), 'out', 20, 'Venta', 34.99, 'ORD-2024-016', NOW() - INTERVAL '19 days'),
((SELECT id FROM products WHERE sku = 'HOGA-TOA-002' LIMIT 1), 'in', 80, 'Recepción de proveedor', 18.00, 'PO-2024-018', NOW() - INTERVAL '31 days'),
((SELECT id FROM products WHERE sku = 'HOGA-TOA-002' LIMIT 1), 'out', 20, 'Venta', 29.99, 'ORD-2024-017', NOW() - INTERVAL '20 days'),
((SELECT id FROM products WHERE sku = 'HOGA-SAB-003' LIMIT 1), 'in', 65, 'Recepción de proveedor', 42.00, 'PO-2024-019', NOW() - INTERVAL '23 days'),
((SELECT id FROM products WHERE sku = 'HOGA-SAB-003' LIMIT 1), 'out', 20, 'Venta', 59.99, 'ORD-2024-018', NOW() - INTERVAL '21 days'),
((SELECT id FROM products WHERE sku = 'HOGA-ALM-004' LIMIT 1), 'in', 75, 'Recepción de proveedor', 35.00, 'PO-2024-020', NOW() - INTERVAL '33 days'),
((SELECT id FROM products WHERE sku = 'HOGA-ALM-004' LIMIT 1), 'out', 20, 'Venta', 49.99, 'ORD-2024-019', NOW() - INTERVAL '22 days'),
((SELECT id FROM products WHERE sku = 'HOGA-ESP-005' LIMIT 1), 'in', 30, 'Recepción de proveedor', 48.00, 'PO-2024-021', NOW() - INTERVAL '36 days'),
((SELECT id FROM products WHERE sku = 'HOGA-ESP-005' LIMIT 1), 'out', 5, 'Venta', 69.99, 'ORD-2024-020', NOW() - INTERVAL '25 days'),
((SELECT id FROM products WHERE sku = 'HOGA-ORG-006' LIMIT 1), 'in', 100, 'Recepción de proveedor', 15.00, 'PO-2024-022', NOW() - INTERVAL '38 days'),
((SELECT id FROM products WHERE sku = 'HOGA-ORG-006' LIMIT 1), 'out', 20, 'Venta', 24.99, 'ORD-2024-021', NOW() - INTERVAL '28 days'),
-- Movimientos de Deportes
((SELECT id FROM products WHERE sku = 'DEPO-ZAP-001' LIMIT 1), 'in', 80, 'Recepción de proveedor', 55.00, 'PO-2024-023', NOW() - INTERVAL '18 days'),
((SELECT id FROM products WHERE sku = 'DEPO-ZAP-001' LIMIT 1), 'out', 20, 'Venta', 79.99, 'ORD-2024-022', NOW() - INTERVAL '8 days'),
((SELECT id FROM products WHERE sku = 'DEPO-EST-002' LIMIT 1), 'in', 110, 'Recepción de proveedor', 18.00, 'PO-2024-024', NOW() - INTERVAL '40 days'),
((SELECT id FROM products WHERE sku = 'DEPO-EST-002' LIMIT 1), 'out', 20, 'Venta', 29.99, 'ORD-2024-023', NOW() - INTERVAL '30 days'),
((SELECT id FROM products WHERE sku = 'DEPO-PES-003' LIMIT 1), 'in', 45, 'Recepción de proveedor', 85.00, 'PO-2024-025', NOW() - INTERVAL '42 days'),
((SELECT id FROM products WHERE sku = 'DEPO-PES-003' LIMIT 1), 'out', 10, 'Venta', 119.99, 'ORD-2024-024', NOW() - INTERVAL '32 days'),
((SELECT id FROM products WHERE sku = 'DEPO-BAL-004' LIMIT 1), 'in', 90, 'Recepción de proveedor', 22.00, 'PO-2024-026', NOW() - INTERVAL '44 days'),
((SELECT id FROM products WHERE sku = 'DEPO-BAL-004' LIMIT 1), 'out', 20, 'Venta', 34.99, 'ORD-2024-025', NOW() - INTERVAL '34 days'),
((SELECT id FROM products WHERE sku = 'DEPO-BIC-005' LIMIT 1), 'in', 20, 'Recepción de proveedor', 220.00, 'PO-2024-027', NOW() - INTERVAL '46 days'),
((SELECT id FROM products WHERE sku = 'DEPO-BIC-005' LIMIT 1), 'out', 5, 'Venta', 299.99, 'ORD-2024-026', NOW() - INTERVAL '36 days'),
((SELECT id FROM products WHERE sku = 'DEPO-BOT-006' LIMIT 1), 'in', 150, 'Recepción de proveedor', 12.00, 'PO-2024-028', NOW() - INTERVAL '48 days'),
((SELECT id FROM products WHERE sku = 'DEPO-BOT-006' LIMIT 1), 'out', 30, 'Venta', 19.99, 'ORD-2024-027', NOW() - INTERVAL '38 days'),
-- Movimientos de Libros
((SELECT id FROM products WHERE sku = 'LIBR-PRO-001' LIMIT 1), 'in', 70, 'Recepción de proveedor', 28.00, 'PO-2024-029', NOW() - INTERVAL '50 days'),
((SELECT id FROM products WHERE sku = 'LIBR-PRO-001' LIMIT 1), 'out', 20, 'Venta', 39.99, 'ORD-2024-028', NOW() - INTERVAL '40 days'),
((SELECT id FROM products WHERE sku = 'LIBR-NOV-002' LIMIT 1), 'in', 85, 'Recepción de proveedor', 16.00, 'PO-2024-030', NOW() - INTERVAL '52 days'),
((SELECT id FROM products WHERE sku = 'LIBR-NOV-002' LIMIT 1), 'out', 20, 'Venta', 24.99, 'ORD-2024-029', NOW() - INTERVAL '42 days'),
((SELECT id FROM products WHERE sku = 'LIBR-COC-003' LIMIT 1), 'in', 55, 'Recepción de proveedor', 20.00, 'PO-2024-031', NOW() - INTERVAL '54 days'),
((SELECT id FROM products WHERE sku = 'LIBR-COC-003' LIMIT 1), 'out', 15, 'Venta', 29.99, 'ORD-2024-030', NOW() - INTERVAL '44 days'),
((SELECT id FROM products WHERE sku = 'LIBR-FIT-004' LIMIT 1), 'in', 60, 'Recepción de proveedor', 24.00, 'PO-2024-032', NOW() - INTERVAL '56 days'),
((SELECT id FROM products WHERE sku = 'LIBR-FIT-004' LIMIT 1), 'out', 15, 'Venta', 34.99, 'ORD-2024-031', NOW() - INTERVAL '46 days');

-- Insertar devoluciones
INSERT INTO returns (order_id, customer, reason, status, refund_amount, created_at) VALUES
((SELECT id FROM orders WHERE customer_name = 'Miguel Torres' ORDER BY created_at DESC LIMIT 1), 'Miguel Torres', 'Producto defectuoso', 'pending', 49.99, NOW() - INTERVAL '1 day'),
((SELECT id FROM orders WHERE customer_name = 'Ana Martínez' ORDER BY created_at DESC LIMIT 1), 'Ana Martínez', 'Cambio de opinión', 'approved', 89.99, NOW() - INTERVAL '7 days');

-- Insertar items de devolución
INSERT INTO return_items (return_id, product_name, quantity, return_type, condition) VALUES
((SELECT id FROM returns WHERE customer = 'Miguel Torres' LIMIT 1), 'Jeans Classic', 1, 'refund', 'defective'),
((SELECT id FROM returns WHERE customer = 'Ana Martínez' LIMIT 1), 'Auriculares Bluetooth', 1, 'refund', 'unopened');

-- Insertar actividades (logs)
INSERT INTO activities (user_name, action, target, category, level, details, created_at) VALUES
('Admin', 'Creó', 'Nuevo producto: Laptop HP 15"', 'producto', 'INFO', 'Se agregó un nuevo producto al catálogo con SKU TECH-LAP-001', NOW() - INTERVAL '15 days'),
('Admin', 'Actualizó', 'Stock del producto: Auriculares Bluetooth', 'producto', 'INFO', 'Se actualizó el stock de 40 a 50 unidades', NOW() - INTERVAL '12 days'),
('Admin', 'Procesó', 'Orden de Ana Martínez', 'orden', 'INFO', 'Orden marcada como completada y enviada', NOW() - INTERVAL '5 days'),
('Admin', 'Creó', 'Nuevo proveedor: TechSupply Co.', 'configuracion', 'INFO', 'Se agregó un nuevo proveedor al sistema', NOW() - INTERVAL '20 days'),
('Sistema', 'Generó', 'Reporte mensual de ventas', 'sistema', 'INFO', 'Reporte automático generado exitosamente', NOW() - INTERVAL '3 days'),
('Admin', 'Aprobó', 'Devolución de Ana Martínez', 'orden', 'INFO', 'Devolución aprobada y reembolso procesado', NOW() - INTERVAL '7 days'),
('Admin', 'Creó', 'Nueva categoría: Deportes', 'configuracion', 'INFO', 'Se agregó una nueva categoría al catálogo', NOW() - INTERVAL '18 days'),
('Admin', 'Actualizó', 'Cupón VERANO2024', 'configuracion', 'INFO', 'Se modificaron las condiciones del cupón', NOW() - INTERVAL '10 days'),
('Sistema', 'Envió', 'Newsletter mensual a 500 suscriptores', 'sistema', 'INFO', 'Campaña de email enviada exitosamente', NOW() - INTERVAL '15 days'),
('Admin', 'Respondió', 'Ticket de soporte #3', 'configuracion', 'INFO', 'Ticket resuelto y cerrado', NOW() - INTERVAL '5 days');
