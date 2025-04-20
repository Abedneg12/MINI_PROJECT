import { Request, Response } from 'express';
import { LoginService } from '../services/login.service';

export const LoginController = async (req: Request, res: Response) => {
  try {
    const result = await LoginService(req.body);
    res.status(200).json({
      success: true,
      message: result.message,
      token: result.token, // ← ini penting
      data: result.user,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || 'Login gagal',
    });
  }
};