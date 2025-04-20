import { PrismaClient } from '@prisma/client';
import { IUpdateProfileInput } from '../interfaces/interfaces';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getMyProfile = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      full_name: true,
      email: true,
      role: true,
      referral_code: true,
      profile_picture: true,
      created_at: true,
    },
  });
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