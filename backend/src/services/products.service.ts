import { CreateProductData } from '@interfaces/product.interface.js';
import { PrismaClient, Prisma, Product, Status, ProductStatus } from '@prisma/client';
import logger from '@utils/logger.js';

const prisma = new PrismaClient();

export class ProductService {
    
  async getAllProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    categoryName?: string;
    status?: string;
  } = {}) {
    try {
      const { page = 1, limit = 20, search, categoryId, categoryName, status } = params;
      const skip = (page - 1) * limit;

      const where: Prisma.ProductWhereInput = {
        AND: []
      };
      
      const andConditions = where.AND as Prisma.ProductWhereInput[];

      if (status) {
        andConditions.push({ status: status as ProductStatus });
      }
      
      if (categoryId) {
        andConditions.push({ categoryId });
      }

      if (categoryName) {
        andConditions.push({
          category: {
            OR: [
              { name: { contains: categoryName, mode: 'insensitive' } },
              { slug: { contains: categoryName, mode: 'insensitive' } }
            ]
          }
        });
      }

      if (search) {
        andConditions.push({
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } }
          ]
        });
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            attributes: true,
            category: true,
            images: true,
            inventory: {
              select: {
                availableQuantity: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take: limit
        }),
        prisma.product.count({ where })
      ]);

      return { products, total };
    } catch (error) {
      logger.error('Error al obtener los productos:', error);
      throw error;
    }
  }

  async createProduct(productData: Omit<CreateProductData, 'categoryId'> & { categoryId?: number; stock?: number }) {
    try {

      const productInput: Prisma.ProductCreateInput = {
        sku: productData.sku,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        costPrice: productData.costPrice,
        slug: productData.slug || '', 
        status: (productData.status as ProductStatus) || 'active',
        ...(productData.attributes && { attributes: productData.attributes }),
        ...(productData.images && { images: productData.images }),
        ...(productData.createdById && { 
          createdBy: { connect: { id: productData.createdById } } 
        })
      };
  
      if (productData.categoryId) {
        productInput.category = { connect: { id: productData.categoryId } };
      } else if (productData.category) {
        // Handle flat category object from frontend
        // @ts-ignore - We know the structure from the frontend
        const catData = productData.category as any;
        if (catData.name) {
             productInput.category = {
               connectOrCreate: {
                 where: { slug: catData.slug || '' },
                 create: {
                   name: catData.name,
                   slug: catData.slug || '',
                   status: (catData.status as Status) || 'active',
                   description: catData.description
                 }
               }
             };
        }
      }
      
      const newProduct = await prisma.product.create({
        data: productInput,
        include: {
          attributes: true,
          category: true,
          images: true,
          inventory: {
            select: {
              availableQuantity: true
            }
          }
        }
      });

      // Handle stock: Create inventory record if stock is provided
      if (productData.stock !== undefined && productData.stock !== null) {
        // Get or create default warehouse
        let defaultWarehouse = await prisma.warehouse.findFirst({
          where: { name: 'Almacén Principal' }
        });

        if (!defaultWarehouse) {
          defaultWarehouse = await prisma.warehouse.create({
            data: {
              name: 'Almacén Principal',
              location: 'Principal',
              status: 'active'
            }
          });
        }

        // Create inventory record
        await prisma.inventory.create({
          data: {
            productId: newProduct.id,
            warehouseId: defaultWarehouse.id,
            quantity: productData.stock,
            availableQuantity: productData.stock,
            reservedQuantity: 0
          }
        });
      }
      
      return newProduct;
    } catch (error) {
      logger.error('Error al crear el producto:', error);
      throw error;
    }
  }

  async updateProduct(id: number, productData: Partial<CreateProductData> & { categoryId?: number; stock?: number }) {
    try {
     
      const updateInput: Prisma.ProductUpdateInput = {
        sku: productData.sku,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        costPrice: productData.costPrice,
        slug: productData.slug,
        status: productData.status as ProductStatus,
      };
  
      
      Object.keys(updateInput).forEach(key => {
        if (updateInput[key as keyof Prisma.ProductUpdateInput] === undefined) {
          delete updateInput[key as keyof Prisma.ProductUpdateInput];
        }
      });
  
    
      if (productData.attributes) {
        // Primero eliminar los atributos actuales
        await prisma.productAttribute.deleteMany({
          where: { productId: id }
        });
        
   
        updateInput.attributes = productData.attributes;
      }
  
      if (productData.images) {
        await prisma.productImage.deleteMany({
          where: { productId: id }
        });
        
        updateInput.images = productData.images;
      }
  
      if (productData.categoryId) {
        updateInput.category = { connect: { id: productData.categoryId } };
      } else if (productData.category) {
         // Handle flat category object
         // @ts-ignore
         const catData = productData.category as any;
         if (catData.name) {
             updateInput.category = {
               connectOrCreate: {
                 where: { slug: catData.slug || '' },
                 create: {
                   name: catData.name,
                   slug: catData.slug || '',
                   status: (catData.status as Status) || 'active',
                   description: catData.description
                 }
               }
             };
        }
      }

      // Handle stock update
      if (productData.stock !== undefined && productData.stock !== null) {
        // Get or create default warehouse
        let defaultWarehouse = await prisma.warehouse.findFirst({
          where: { name: 'Almacén Principal' }
        });

        if (!defaultWarehouse) {
          defaultWarehouse = await prisma.warehouse.create({
            data: {
              name: 'Almacén Principal',
              location: 'Principal',
              status: 'active'
            }
          });
        }

        // Update or create inventory record
        const existingInventory = await prisma.inventory.findUnique({
          where: {
            productId_warehouseId: {
              productId: id,
              warehouseId: defaultWarehouse.id
            }
          }
        });

        if (existingInventory) {
          await prisma.inventory.update({
            where: { id: existingInventory.id },
            data: {
              quantity: productData.stock,
              availableQuantity: productData.stock,
            }
          });
        } else {
          await prisma.inventory.create({
            data: {
              productId: id,
              warehouseId: defaultWarehouse.id,
              quantity: productData.stock,
              availableQuantity: productData.stock,
              reservedQuantity: 0
            }
          });
        }
      }
  
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: updateInput,
        include: {
          attributes: true,
          category: true,
          images: true,
          inventory: {
            select: {
              availableQuantity: true
            }
          }
        }
      });
      
      return updatedProduct;
    } catch (error) {
      logger.error('Error al actualizar el producto:', error);
      throw error;
    }
  }

  async deleteProduct(id: number) {
    try {

      await prisma.productAttribute.deleteMany({
        where: {
          productId: id
        }
      });

      await prisma.productImage.deleteMany({
        where: {
          productId: id
        }
      });

      // Delete inventory records
      await prisma.inventory.deleteMany({
        where: { productId: id }
      });
        
      await prisma.product.delete({
        where: { id },
      });
      
      return "Producto eliminado exitosamente";
    } catch (error) {
      logger.error('Error al eliminar el producto:', error);
      throw error;
    }
  }

  async getProductById(id: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          attributes: true,
          category: true,
          images: true,
          inventory: {
            select: {
              availableQuantity: true
            }
          }
        }
      });
      
      if (!product) {
        throw new Error(`Producto con ID ${id} no encontrado`);
      }
      
      return product;
    } catch (error) {
      logger.error(`Error al obtener el producto con ID ${id}:`, error);
      throw error;
    }
  }
}