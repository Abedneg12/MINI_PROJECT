import { PrismaClient } from '@prisma/client';
import { ICreateVoucherInput } from '../interfaces/voucher.interface';

const prisma = new PrismaClient();

export const createVoucher = async (
  eventId: number,
  organizerId: number,
  input: ICreateVoucherInput
) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.organizer_id !== organizerId) {
    throw new Error('Event tidak ditemukan atau bukan milik Anda');
  }

  return prisma.voucher.create({
    data: {
      event_id: eventId,
      code: input.code,
      discount_amount: input.discount_amount,
      start_date: new Date(input.start_date),
      end_date: new Date(input.end_date),
    },
  });
};
