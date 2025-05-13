import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/response';
import { AuthRequest } from '../middlewares/auth';
import { createVoucherSchema } from '../validations/createVoucherSchema';
import * as VoucherService from '../services/voucher.service';

export const createVoucherController = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const organizerId = req.user?.id;
      const eventId = Number(req.params.id);
      if (!organizerId) {
        errorResponse(res, 'Unauthorized', 401);
        return;
      }
  
      const parsed = createVoucherSchema.safeParse(req.body);
      if (!parsed.success) {
        errorResponse(res, parsed.error.errors[0].message, 400);
        return;
      }
  
      const input = {
        ...parsed.data,
        start_date: new Date(parsed.data.start_date),
        end_date: new Date(parsed.data.end_date),
      };
  
      const result = await VoucherService.createVoucher(eventId, organizerId, input);
      successResponse(res, result, 'Voucher berhasil dibuat');
    } catch (err: any) {
      errorResponse(res, err.message || 'Gagal membuat voucher', 500);
    }
  };
  
