import { PrismaClient } from '@prisma/client';
import { IUpdateProfileInput } from '../interfaces/profile.interface';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();


export const getCustomerProfileService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      full_name: true,
      email: true,
      referral_code: true,
      is_verified: true,
      profile_picture: true,
      points: {
        select: {
          amount: true,
        },
      },
      coupons: {
        where: { is_used: false },
        select: {
          id: true,
          code: true,
          discount_amount: true,
          expired_at: true,
        },
      },
      transactions: {
        where: {
          used_voucher_id: {
            not: null,
          },
        },
        select: {
          used_voucher: {
            select: {
              id: true,
              code: true,
              discount_amount: true,
              event: {
                select: {
                  name: true,
                  start_date: true,
                },
              },
            },
          },
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
    profile_picture: user?.profile_picture,
    point: (user.points || []).reduce((acc, curr) => acc + curr.amount, 0),
    coupons: user.coupons,
    vouchers: user.transactions.map((tx) => tx.used_voucher),
  };
};

export const getOrganizerProfileService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      full_name: true,
      email: true,
      profile_picture: true,
      is_verified: true,
      events: {
        select: {
          id: true,
          name: true,
          start_date: true,
          image_url: true,
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
    profile_picture: user.profile_picture,
    is_verified: user.is_verified,
    events: user.events, // jika tidak mau tampilkan events, hapus bagian ini
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