import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { errorResponse} from '../utils/response';
import { FE_PORT } from '../config';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecuresecret';

export const verifyEmailController = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    errorResponse(res, 'Token tidak ditemukan atau tidak valid', 400);
    return;
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      errorResponse(res, 'User tidak ditemukan', 404);
      return;
    }

    if (user.is_verified) {
       return res.redirect(`${FE_PORT}/email-verified-success`);
    }

    await prisma.user.update({
      where: { id: decoded.id },
      data: { is_verified: true },
    });

    return res.redirect(`${FE_PORT}/email-verified-success`);
  } catch (error: any) {
    errorResponse(res, 'Token tidak valid atau sudah kedaluwarsa', 401);
  }
};
