import { Request, Response } from 'express';
import { ReturnsService } from '../services/returns.service.js';

const returnsService = new ReturnsService();

export const getReturns = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const search = req.query.search as string;
        const status = req.query.status as string;

        const result = await returnsService.getReturns({ page, limit, search, status });
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getReturnById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await returnsService.getReturnById(id);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createReturn = async (req: Request, res: Response) => {
    try {
        const result = await returnsService.createReturn(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateReturnStatus = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const result = await returnsService.updateReturnStatus(id, status);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
