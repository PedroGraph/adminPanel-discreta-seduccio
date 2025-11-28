import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  

  async getAnalytics(req: Request, res: Response) {
    try {
      const analytics = await analyticsService.getAnalytics();
      
      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las estadísticas de analytics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }


  async getConversionRate(req: Request, res: Response) {
    try {
      const conversionRate = await analyticsService.getWeeklyConversionRate();
      
      res.status(200).json({
        success: true,
        data: conversionRate
      });
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la tasa de conversión',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
