import { PrismaClient, SupplierReliability, Status } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSuppliers(): Promise<void> {
    const suppliersData = [
        {
            name: 'Textiles Modernos S.A. de C.V.',
            contactPerson: 'Laura Martínez',
            email: 'ventas@textilesmodernos.com.mx',
            phone: '+52 55 2345-6789',
            address: 'Calle Industria 123, Naucalpan, Estado de México',
            taxId: 'TMS180515ABC',
            paymentTerms: '30 días',
            leadTime: '7-10 días',
            reliability: SupplierReliability.High,
            status: Status.active,
        },
        {
            name: 'Calzado Premium Internacional',
            contactPerson: 'Ricardo Sánchez',
            email: 'contacto@calzadopremium.com',
            phone: '+52 33 3456-7890',
            address: 'Av. Américas 456, Guadalajara, Jalisco',
            taxId: 'CPI190820XYZ',
            paymentTerms: '45 días',
            leadTime: '14-21 días',
            reliability: SupplierReliability.High,
            status: Status.active,
        },
        {
            name: 'Accesorios y Moda Global',
            contactPerson: 'Ana Patricia Ruiz',
            email: 'ventas@accesoriosglobal.com',
            phone: '+52 81 4567-8901',
            address: 'Blvd. Díaz Ordaz 789, Monterrey, Nuevo León',
            taxId: 'AMG200315DEF',
            paymentTerms: '30 días',
            leadTime: '5-7 días',
            reliability: SupplierReliability.Medium,
            status: Status.active,
        },
        {
            name: 'Distribuidora Fashion Express',
            contactPerson: 'Carlos Hernández',
            email: 'info@fashionexpress.mx',
            phone: '+52 55 5678-9012',
            address: 'Calle Comercio 321, Querétaro, Querétaro',
            taxId: 'DFE210710GHI',
            paymentTerms: '15 días',
            leadTime: '3-5 días',
            reliability: SupplierReliability.High,
            status: Status.active,
        },
        {
            name: 'Importadora Estilo y Tendencia',
            contactPerson: 'Sofía Ramírez',
            email: 'compras@estiloytendencia.com',
            phone: '+52 33 6789-0123',
            address: 'Av. Patria 654, Zapopan, Jalisco',
            taxId: 'IET220505JKL',
            paymentTerms: '60 días',
            leadTime: '21-30 días',
            reliability: SupplierReliability.Medium,
            status: Status.active,
        },
    ];

    for (const supplier of suppliersData) {
        await prisma.supplier.upsert({
            where: { name: supplier.name },
            update: supplier,
            create: supplier,
        });
    }
    console.log('✅ Proveedores sembrados exitosamente');
}