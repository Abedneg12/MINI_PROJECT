import { Response } from 'express';

export const successResponse = (
  res: Response,
  data: any,
  message = 'Berhasil',
  status = 200
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message = 'Terjadi kesalahan',
  status = 400
) => {
  return res.status(status).json({
    success: false,
    message,
  });
};
