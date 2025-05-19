import { PrismaClient } from '@prisma/client';
import { generateTransactionCode } from '../utils/code';

const prisma = new PrismaClient();

export const createTransactionService = async (
  user_id: number,
  event_id: number,
  ticket_quantity: number,
  voucher_code?: string,
  coupon_code?: string,
  used_point?: number
) => {
  return prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({ where: { id: event_id } });
    if (!event) throw new Error('Event tidak ditemukan');

    if (event.remaining_seats < ticket_quantity) {
      throw new Error('Sisa kursi tidak mencukupi');
    }

    let discount = 0;
    let used_voucher_id: number | undefined = undefined;
    let used_coupon_id: number | undefined = undefined;
    let pointUsed = 0;


    if (voucher_code) {
      const voucher = await tx.voucher.findUnique({ where: { code: voucher_code } });
      if (!voucher) throw new Error('Voucher tidak ditemukan');
      if (voucher.event_id !== event_id) throw new Error('Voucher tidak berlaku untuk event ini');
      const now = new Date();
      if (now < voucher.start_date || now > voucher.end_date || !voucher.is_active) {
        throw new Error('Voucher sudah kedaluwarsa atau tidak aktif');
      }

      discount += voucher.discount_amount;
      used_voucher_id = voucher.id;
    }

    
    if (coupon_code) {
      const coupon = await tx.coupon.findUnique({ where: { code: coupon_code } });
      if (!coupon) throw new Error('Kupon tidak ditemukan');
      if (coupon.user_id !== user_id) throw new Error('Kupon bukan milik Anda');
      const now = new Date();
      if (coupon.is_used) throw new Error('Kupon sudah digunakan');
      if (now > coupon.expired_at) throw new Error('Kupon sudah kedaluwarsa');

      discount += coupon.discount_amount;
      used_coupon_id = coupon.id;
    }


    if (used_point && used_point > 0) {
      const totalPoint = await tx.point.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          user_id,
          is_expired: false,
          expired_at: { gt: new Date() },
        },
      });

      const availablePoints = totalPoint._sum.amount || 0;
      if (used_point > availablePoints) {
        throw new Error('Poin tidak mencukupi');
      }

      pointUsed = used_point;
      discount += used_point;
    }

    const ticket_code = generateTransactionCode(user_id, event_id);
    const base_price = event.price * ticket_quantity;
    const total_price = Math.max(base_price - discount, 0);

    const transaction = await tx.transaction.create({
      data: {
        user_id,
        event_id,
        ticket_quantity,
        price: event.price,
        total_price,
        ticket_code,
        status: 'WAITING_FOR_PAYMENT',
        used_voucher_id,
        used_coupon_id,
        used_point: pointUsed,
      },
    });

  
    await tx.event.update({
      where: { id: event_id },
      data: {
        remaining_seats: { decrement: ticket_quantity },
      },
    });

    return transaction;
  });
};
