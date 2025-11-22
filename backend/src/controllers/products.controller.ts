import { Request, Response, NextFunction } from 'express';
import { ProductService } from '@services/products.service.js';
import logger from '@utils/logger.js';
import { AppError } from '@utils/AppError.js';
import { sendSuccess, sendCreated } from '@utils/response.utils.js';

const productService = new ProductService();

export class ProductController {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getAllProducts();
      sendSuccess(res, products);
    } catch (error) {
      logger.error('Error obteniendo productos:', error);
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);
      sendCreated(res, product, 'Producto creado exitosamente');
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
      sendSuccess(res, product, 'Producto actualizado exitosamente');
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
