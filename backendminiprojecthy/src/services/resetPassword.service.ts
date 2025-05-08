import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import { IResetPasswordInput } from '../interfaces/profile.interface';

export const resetPasswordService = async (userId: number, input: IResetPasswordInput) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User tidak ditemukan');

  const isMatch = await bcrypt.compare(input.currentPassword, user.password);
  if (!isMatch) throw new Error('Password saat ini salah');

  const hashedNewPassword = await bcrypt.hash(input.newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return { message: 'Password berhasil diperbarui' };
};