import { Prisma, Category, Status } from '@prisma/client';
import prisma from '@/lib/prisma.js';
import logger from '@utils/logger.js';


export class CategoryService {
  
  async getAllCategories(params: {
    search?: string;
    status?: string;
  } = {}) {
    try {
      const { search, status } = params;

      const where: Prisma.CategoryWhereInput = {
        AND: []
      };
      
      const andConditions = where.AND as Prisma.CategoryWhereInput[];

      if (status) {
        andConditions.push({ status: status as Status });
      }

      if (search) {
        andConditions.push({
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        });
      }

      const categories = await prisma.category.findMany({
        where,
        include: {
          _count: {
            select: { products: true }
          },
          parent: true,
          children: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Transform to include product count at top level
      const transformedCategories = categories.map(cat => ({
        ...cat,
        productCount: cat._count.products
      }));

      const total = await prisma.category.count({ where });
      const activeCount = await prisma.category.count({ where: { status: 'active' } });
      const totalProducts = await prisma.product.count();

      return { 
        categories: transformedCategories, 
        total,
        activeCount,
        totalProducts
      };
    } catch (error) {
      logger.error('Error al obtener las categorías:', error);
      throw error;
    }
  }

  async createCategory(data: {
    name: string;
    slug?: string;
    description?: string;
    parentId?: number;
    status?: Status;
  }) {
    try {
      const category = await prisma.category.create({
        data: {
          name: data.name,
          slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
          description: data.description,
          status: data.status || 'active',
          ...(data.parentId && { parent: { connect: { id: data.parentId } } })
        }
      });
      return category;
    } catch (error) {
      logger.error('Error al crear la categoría:', error);
      throw error;
    }
  }

  async updateCategory(id: number, data: {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: number | null;
    status?: Status;
  }) {
    try {
      const updateData: Prisma.CategoryUpdateInput = {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description && { description: data.description }),
        ...(data.status && { status: data.status }),
      };

      if (data.parentId !== undefined) {
        if (data.parentId === null) {
            updateData.parent = { disconnect: true };
        } else {
            updateData.parent = { connect: { id: data.parentId } };
        }
      }

      const category = await prisma.category.update({
        where: { id },
        data: updateData
      });
      return category;
    } catch (error) {
      logger.error('Error al actualizar la categoría:', error);
      throw error;
    }
  }

  async deleteCategory(id: number) {
    try {
      // Check if category has products
      const category = await prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { products: true } } }
      });

      if (category && category._count.products > 0) {
        throw new Error('No se puede eliminar una categoría que tiene productos asociados.');
      }

      await prisma.category.delete({
        where: { id }
      });
      return "Categoría eliminada exitosamente";
    } catch (error) {
      logger.error('Error al eliminar la categoría:', error);
      throw error;
    }
  }

  async getCategoryById(id: number) {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          parent: true,
          children: true
        }
      });
      return category;
    } catch (error) {
      logger.error('Error al obtener la categoría:', error);
      throw error;
    }
  }
}
