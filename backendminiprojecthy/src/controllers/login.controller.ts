import { Request, Response } from 'express';
import { LoginService } from '../services/login.service';
import { successResponse, errorResponse } from '../utils.ts/response';

export const LoginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await LoginService(req.body);

    successResponse(res, {
      token: result.token,
      user: result.user,
    }, result.message);
    
  } catch (error: any) {
    errorResponse(res, error.message || 'Login gagal', 401);
  }
};
