import { Request, Response, NextFunction } from 'express';
import { ProductService } from '@services/products.service.js';
import { ProductStatsService } from '@services/productStats.service.js';
import logger from '@utils/logger.js';
import { AppError } from '@utils/AppError.js';
import { sendSuccess, sendCreated } from '@utils/response.utils.js';

const productService = new ProductService();
const productStatsService = new ProductStatsService();

export class ProductController {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const categoryName = req.query.categoryName as string;
      const status = req.query.status as string;
      
      const { products, total } = await productService.getAllProducts({
        page,
        limit,
        search,
        categoryId,
        categoryName,
        status
      });

      const stats = await productStatsService.getProductStats();
      
      // Transform products to include primary image and total stock
      const productsWithExtras = products.map((product: any) => ({
        ...product,
        image: product.images?.find((img: any) => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || null,
        stock: product.inventory?.reduce((sum: number, inv: any) => sum + inv.availableQuantity, 0) || 0
      }));
      
      sendSuccess(res, {
        products: productsWithExtras,
        stats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Error obteniendo productos:', error);
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);
      
      // Transform product to include primary image and stock (same as getAllProducts)
      const productWithExtras = {
        ...product,
        image: product.images?.find((img: any) => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || null,
        stock: product.inventory?.reduce((sum: number, inv: any) => sum + inv.availableQuantity, 0) || 0
      };
      
      sendCreated(res, productWithExtras, 'Producto creado exitosamente');
    } catch (error) {
      logger.error('Error creando producto:', error);
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new AppError('ID de producto inválido', 400);
      }
      const product = await productService.updateProduct(id, req.body);
      
      // Transform product to include primary image and stock (same as getAllProducts)
      const productWithExtras = {
        ...product,
        image: product.images?.find((img: any) => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || null,
        stock: product.inventory?.reduce((sum: number, inv: any) => sum + inv.availableQuantity, 0) || 0
      };
      
      sendSuccess(res, productWithExtras, 'Producto actualizado exitosamente');
    } catch (error) {
      logger.error('Error actualizando producto:', error);
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new AppError('ID de producto inválido', 400);
      }
      await productService.deleteProduct(id);
      sendSuccess(res, null, 'Producto eliminado exitosamente');
    } catch (error) {
      logger.error('Error eliminando producto:', error);
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new AppError('ID de producto inválido', 400);
      }
      const product = await productService.getProductById(id);
      sendSuccess(res, product);
    } catch (error) {
      logger.error('Error obteniendo producto:', error);
      next(error);
    }
  }
}
