import { AuthRequest } from "../middlewares/auth";
import { errorResponse, successResponse } from "../utils/response";
import { resetPasswordSchema } from "../validations/reset.password.validation";
import { resetPasswordService } from "../services/resetPassword.service";
import { Response } from 'express';
import express from 'express';

const router = express.Router();

export const resetPasswordController = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        errorResponse(res, 'Unauthorized', 401);
        return;
      }
  
      const parsed = resetPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        errorResponse(res, parsed.error.errors[0].message, 400);
        return;
      }
  
      const result = await resetPasswordService(userId, parsed.data);
      successResponse(res, null, result.message);
    } catch (error: any) {
      errorResponse(res, error.message || 'Gagal reset password', 500);
    }
  };
