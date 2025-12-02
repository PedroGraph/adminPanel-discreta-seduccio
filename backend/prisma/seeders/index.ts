import { seedUsers } from './01-users.js';
import { seedCategories } from './02-categories.js';
import { seedProducts } from './03-products.js';
import { seedWarehouses } from './04-warehouses.js';
import { seedSuppliers } from './05-suppliers.js';
import { seedInventory } from './06-inventory.js';
import { seedCoupons } from './07-coupons.js';
import { seedCustomers } from './09-customers.js';
import { seedOrders } from './10-orders.js';

async function main(): Promise<void> {
    try {
        console.log('🌱 Iniciando proceso de seed...');

        // 1. Core Data
        await seedUsers();
        await seedCategories();
        await seedWarehouses();
        await seedSuppliers();

        // 2. Product Catalog
        await seedProducts();

        // 3. Inventory & Pricing
        await seedInventory();
        await seedCoupons();

        // 4. Customer Data
        await seedCustomers();

        // 5. Transactional Data
        await seedOrders();

        console.log('✅ Proceso de seed completado exitosamente');
    } catch (error) {
        console.error('❌ Error durante el proceso de seed:', error);
        process.exit(1);
    }
}

main();