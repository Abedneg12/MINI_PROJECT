import { Request, Response } from 'express';
import { RegisterService } from '../services/register.service';

export const RegisterController = async (req: Request, res: Response) => {
  try {
    const result = await RegisterService(req.body);
    res.status(201).json({
      success: true,
      message: result.message,
      data: result.user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Registrasi gagal',
    });
  }
};