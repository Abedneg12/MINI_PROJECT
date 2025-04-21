import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

export function roleMiddleware(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Role tidak diizinkan',
      });
      return; // ← tambahkan return agar function tidak lanjut ke `next()`
    }

    next(); // lanjut ke handler berikutnya
  };
}
