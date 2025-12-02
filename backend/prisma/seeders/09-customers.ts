import { PrismaClient, AddressType } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCustomers(): Promise<void> {
    const customersData = [
        {
            name: 'Ana María García López',
            email: 'ana.garcia@email.com',
            phone: '+52 55 1234-5678',
            addresses: [
                {
                    addressType: AddressType.shipping,
                    addressLine1: 'Calle Reforma 123, Depto 4B',
                    addressLine2: 'Entre Juárez y Madero',
                    city: 'Ciudad de México',
                    state: 'CDMX',
                    postalCode: '06600',
                    country: 'México',
                    isDefault: true,
                },
                {
                    addressType: AddressType.billing,
                    addressLine1: 'Av. Universidad 456',
                    city: 'Ciudad de México',
                    state: 'CDMX',
                    postalCode: '04510',
                    country: 'México',
                    isDefault: false,
                },
            ],
        },
        {
            name: 'Carlos Eduardo Martínez',
            email: 'carlos.martinez@email.com',
            phone: '+52 33 2345-6789',
            addresses: [
                {
                    addressType: AddressType.shipping,
                    addressLine1: 'Av. Américas 789',
                    city: 'Guadalajara',
                    state: 'Jalisco',
                    postalCode: '44100',
                    country: 'México',
                    isDefault: true,
                },
            ],
        },
        {
            name: 'María Fernanda Rodríguez',
            email: 'maria.rodriguez@email.com',
            phone: '+52 81 3456-7890',
            addresses: [
                {
                    addressType: AddressType.shipping,
                    addressLine1: 'Blvd. Díaz Ordaz 321, Col. Santa María',
                    city: 'Monterrey',
                    state: 'Nuevo León',
                    postalCode: '64650',
                    country: 'México',
                    isDefault: true,
                },
            ],
        },
        {
            name: 'José Luis Hernández',
            email: 'jose.hernandez@email.com',
            phone: '+52 55 4567-8901',
            addresses: [
                {
                    addressType: AddressType.shipping,
                    addressLine1: 'Calle Morelos 654',
                    city: 'Puebla',
                    state: 'Puebla',
                    postalCode: '72000',
                    country: 'México',
                    isDefault: true,
                },
            ],
        },
        {
            name: 'Laura Patricia Sánchez',
            email: 'laura.sanchez@email.com',
            phone: '+52 33 5678-9012',
            addresses: [
                {
                    addressType: AddressType.shipping,
                    addressLine1: 'Av. Patria 987, Col. Jardines',
                    city: 'Zapopan',
                    state: 'Jalisco',
                    postalCode: '45030',
                    country: 'México',
                    isDefault: true,
                },
            ],
        },
        {
            name: 'Roberto Carlos Gómez',
            email: 'roberto.gomez@email.com',
            phone: '+52 55 6789-0123',
            addresses: [
                {
                    addressType: AddressType.shipping,
                    addressLine1: 'Calle 5 de Mayo 147',
                    city: 'Querétaro',
                    state: 'Querétaro',
                    postalCode: '76000',
                    country: 'México',
                    isDefault: true,
                },
            ],
        },
        {
            name: 'Diana Sofía Torres',
            email: 'diana.torres@email.com',
            phone: '+52 81 7890-1234',
            addresses: [
                {
                    addressType: AddressType.shipping,
                    addressLine1: 'Av. Constitución 258, Col. Centro',
                    city: 'Monterrey',
                    state: 'Nuevo León',
                    postalCode: '64000',
                    country: 'México',
                    isDefault: true,
                },
            ],
        },
        {
            name: 'Miguel Ángel Ramírez',
            email: 'miguel.ramirez@email.com',
            phone: '+52 55 8901-2345',
            addresses: [
                {
                    addressType: AddressType.shipping,
                    addressLine1: 'Calle Insurgentes 369',
                    city: 'Toluca',
                    state: 'Estado de México',
                    postalCode: '50000',
                    country: 'México',
                    isDefault: true,
                },
            ],
        },
        {
            name: 'Gabriela Alejandra Flores',
            email: 'gabriela.flores@email.com',
            phone: '+52 33 9012-3456',
            addresses: [
                {
                    addressType: AddressType.shipping,
                    addressLine1: 'Av. López Mateos 741',
                    city: 'Guadalajara',
                    state: 'Jalisco',
                    postalCode: '44160',
                    country: 'México',
                    isDefault: true,
                },
            ],
        },
        {
            name: 'Fernando Javier Cruz',
            email: 'fernando.cruz@email.com',
            phone: '+52 55 0123-4567',
            addresses: [
                {
                    addressType: AddressType.shipping,
                    addressLine1: 'Calle Hidalgo 852',
                    city: 'Cuernavaca',
                    state: 'Morelos',
                    postalCode: '62000',
                    country: 'México',
                    isDefault: true,
                },
            ],
        },
    ];

    for (const customerData of customersData) {
        const { addresses, ...customer } = customerData;

        const createdCustomer = await prisma.customer.upsert({
            where: { email: customer.email },
            update: customer,
            create: {
                ...customer,
                status: 'active',
                lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
            },
        });

        // Crear direcciones si no existen
        for (const address of addresses) {
            const existingAddress = await prisma.customerAddress.findFirst({
                where: {
                    customerId: createdCustomer.id,
                    addressType: address.addressType,
                },
            });

            if (!existingAddress) {
                await prisma.customerAddress.create({
                    data: {
                        customerId: createdCustomer.id,
                        ...address,
                    },
                });
            }
        }
    }
    console.log('✅ Clientes sembrados exitosamente');
}
