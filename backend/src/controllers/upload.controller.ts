import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/AppError.js';
import { sendSuccess } from '@utils/response.utils.js';
import logger from '@utils/logger.js';
import cloudinary from '@config/cloudinary.config.js';

export class UploadController {
  
  async uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('No se proporcionó ningún archivo', 400);
      }

      const file = req.file as Express.Multer.File & { path: string };

      sendSuccess(res, {
        url: file.path,
        publicId: (file as any).filename,
        format: (file as any).format,
        width: (file as any).width,
        height: (file as any).height,
      }, 'Imagen subida exitosamente');
    } catch (error) {
      logger.error('Error subiendo imagen:', error);
      next(error);
    }
  }

 
  async uploadMultiple(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        throw new AppError('No se proporcionaron archivos', 400);
      }

      const files = req.files as Express.Multer.File[];
      
      const uploadedFiles = files.map((file: any) => ({
        url: file.path,
        publicId: file.filename,
        format: file.format,
        width: file.width,
        height: file.height,
      }));

      sendSuccess(res, {
        images: uploadedFiles,
        count: uploadedFiles.length,
      }, `${uploadedFiles.length} imagen(es) subida(s) exitosamente`);
    } catch (error) {
      logger.error('Error subiendo imágenes:', error);
      next(error);
    }
  }

 
  async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { publicId } = req.body;

      if (!publicId) {
        throw new AppError('Se requiere el publicId de la imagen', 400);
      }

      await cloudinary.uploader.destroy(publicId);

      sendSuccess(res, null, 'Imagen eliminada exitosamente');
    } catch (error) {
      logger.error('Error eliminando imagen:', error);
      next(error);
    }
  }
}
