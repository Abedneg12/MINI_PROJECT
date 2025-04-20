import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserPayload } from '../interfaces/interfaces';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: token tidak ditemukan',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as IUserPayload;
    req.user = decoded;
    next(); // <--- ini wajib dipanggil kalau berhasil
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: token tidak valid',
    });
  }
};
