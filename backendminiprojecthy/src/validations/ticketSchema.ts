import { z } from 'zod';

export const ticketSchema = z.object({
  type: z.enum(['FREE', 'VIP', 'REGULAR'], {
    required_error: 'Tipe tiket wajib diisi',
  }),
  price: z
    .number({ required_error: 'Harga tiket wajib diisi' })
    .min(0, { message: 'Harga tiket minimal 0' }),
  quantity: z
    .number({ required_error: 'Jumlah tiket wajib diisi' })
    .min(1, { message: 'Jumlah tiket minimal 1' }),
  description: z.string().optional(),
});

export const ticketArraySchema = z.array(ticketSchema).min(1, {
  message: 'Minimal harus ada 1 tiket',
});