import { PrismaClient, AddressType } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCustomers(): Promise<void> {
    const customersData = [
        { name: 'Ana García', email: 'ana@example.com', phone: '555-2001' },
        { name: 'Carlos López', email: 'carlos@example.com', phone: '555-2002' },
        { name: 'María Rodríguez', email: 'maria@example.com', phone: '555-2003' },
    ];

    for (const cust of customersData) {
        const customer = await prisma.customer.upsert({
            where: { email: cust.email },
            update: cust,
            create: {
                ...cust,
                status: 'active',
            },
        });

        // Create Address if not exists
        const existingAddress = await prisma.customerAddress.findFirst({
            where: { customerId: customer.id },
        });

        if (!existingAddress) {
            await prisma.customerAddress.create({
                data: {
                    customerId: customer.id,
                    addressType: AddressType.shipping,
                    addressLine1: 'Calle Falsa 123',
                    city: 'Ciudad de México',
                    state: 'CDMX',
                    postalCode: '01000',
                    country: 'México',
                    isDefault: true,
                },
            });
        }
    }
    console.log('✅ Clientes sembrados exitosamente');
}
