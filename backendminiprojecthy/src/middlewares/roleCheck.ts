import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const customerOnly = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (req.user?.role !== 'CUSTOMER') {
    res.status(403).json({
      success: false,
      message: 'Access denied: CUSTOMER only',
    });
    return;
  }
  return next();
};
export const organizerOnly = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (req.user?.role !== 'ORGANIZER') {
    res.status(403).json({
      success: false,
      message: 'Access denied: ORGANIZER only',
    });
    return;
  }
  return next();
};
