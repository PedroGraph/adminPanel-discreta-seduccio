import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedWarehouses(): Promise<void> {
    const warehousesData = [
        {
            name: 'Almacén Central CDMX',
            location: 'Ciudad de México',
            address: 'Av. Insurgentes Sur 1234, Col. Del Valle',
            status: Status.active,
            contactPerson: 'Juan Carlos Méndez',
            contactEmail: 'almacen.cdmx@discretaseduccion.com',
            contactPhone: '+52 55 1234-5678',
        },
        {
            name: 'Almacén Guadalajara',
            location: 'Guadalajara, Jalisco',
            address: 'Av. López Mateos 567, Col. Providencia',
            status: Status.active,
            contactPerson: 'María Elena Torres',
            contactEmail: 'almacen.gdl@discretaseduccion.com',
            contactPhone: '+52 33 8765-4321',
        },
        {
            name: 'Almacén Monterrey',
            location: 'Monterrey, Nuevo León',
            address: 'Av. Constitución 890, Col. Centro',
            status: Status.active,
            contactPerson: 'Roberto Garza',
            contactEmail: 'almacen.mty@discretaseduccion.com',
            contactPhone: '+52 81 9876-5432',
        },
    ];

    for (const warehouse of warehousesData) {
        await prisma.warehouse.upsert({
            where: { name: warehouse.name },
            update: warehouse,
            create: warehouse,
        });
    }
    console.log('✅ Almacenes sembrados exitosamente');
}