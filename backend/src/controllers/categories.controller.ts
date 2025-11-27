import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '@services/categories.service.js';
import { sendSuccess, sendCreated } from '@utils/response.utils.js';
import { AppError } from '@utils/AppError.js';

const categoryService = new CategoryService();

export class CategoryController {
  
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const status = req.query.status as string;

      const result = await categoryService.getAllCategories({
        search,
        status
      });

      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new AppError('ID de categoría inválido', 400);
      }
      const category = await categoryService.getCategoryById(id);
      if (!category) {
        throw new AppError('Categoría no encontrada', 404);
      }
      sendSuccess(res, category);
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.createCategory(req.body);
      sendCreated(res, category, 'Categoría creada exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new AppError('ID de categoría inválido', 400);
      }
      const category = await categoryService.updateCategory(id, req.body);
      sendSuccess(res, category, 'Categoría actualizada exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new AppError('ID de categoría inválido', 400);
      }
      await categoryService.deleteCategory(id);
      sendSuccess(res, null, 'Categoría eliminada exitosamente');
    } catch (error) {
      next(error);
    }
  }
}
