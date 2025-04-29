import { Request, Response } from 'express';
import { RegisterService } from '../services/register.service';
import { IRegisterInput } from '../interfaces/interfaces';
import { successResponse, errorResponse } from '../utils/response';

export const RegisterController = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: IRegisterInput = req.body;
    const result = await RegisterService(input);

    successResponse(res, result.user, result.message, 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Terjadi kesalahan saat registrasi');
  }
};
