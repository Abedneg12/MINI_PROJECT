import { PrismaClient } from '@prisma/client';
import { IUpdateProfileInput } from '../interfaces/interfaces';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();


export const getCustomerProfileService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      points: true,
      coupons: {
        where: { is_used: false },
      },
      transactions: {
        where: {
          used_voucher_id: {
            not: null,
          },
        },
        include: {
          used_voucher: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    referral_code: user.referral_code,
    is_verified: user.is_verified,
    point: (user.points || []).reduce((acc, curr) => acc + curr.amount, 0),
    coupons: user.coupons,
    vouchers: user.transactions.map((tx) => tx.used_voucher),
  };
};

export const updateMyProfile = async (userId: number, input: IUpdateProfileInput) => {
  const updateData: any = {};

  if (input.full_name) updateData.full_name = input.full_name;
  if (input.profile_picture) updateData.profile_picture = input.profile_picture;
  if (input.password) {
    const hashed = await bcrypt.hash(input.password, 10);
    updateData.password = hashed;
  }

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
};