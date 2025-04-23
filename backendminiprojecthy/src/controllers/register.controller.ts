import { Request, Response } from 'express';
import { RegisterService } from '../services/register.service';
import { IRegisterInput } from '../interfaces/interfaces';

export const RegisterController = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: IRegisterInput = req.body;
    const result = await RegisterService(input);
    res.status(201).json({
      success: true,
      message: result.message,
      data: result.user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat registrasi',
    });
  }
};
