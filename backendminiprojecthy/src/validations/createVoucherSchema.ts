import { z } from 'zod';

export const createVoucherSchema = z.object({
  code: z.string().min(3),
  discount_amount: z.number().min(1),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
});
