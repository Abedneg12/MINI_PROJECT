import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { createTransactionService } from '../services/transaction.service';
import { successResponse, errorResponse } from '../utils/response';

export const createTransactionController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      event_id,
      ticket_quantity,
      voucher_code,
      coupon_code,
      used_point,
    } = req.body;

    // Validasi input minimal
    if (!event_id || !ticket_quantity) {
      errorResponse(res, 'event_id dan ticket_quantity wajib diisi', 400);
      return;
    }

    const transaction = await createTransactionService(
      userId,
      Number(event_id),
      Number(ticket_quantity),
      voucher_code,
      coupon_code,
      Number(used_point) || 0
    );

    successResponse(res, transaction, 'Transaksi berhasil dibuat');
  } catch (error) {
    next(error);
  }
};
