import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import { IResetPasswordInput } from '../interfaces/profile.interface';
import jwt from 'jsonwebtoken';
import { sendResetPasswordemail } from '../utils/resetPasswordnotification';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecuresecret';
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

  const verifyresetpassword = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    {expiresIn: '1h'}
  )
  const emailResetpassword = `http://localhost:5000/reset-password/${verifyresetpassword}`;
  await sendResetPasswordemail(
    user.email,
    user.full_name,
    emailResetpassword
  );


  return { message: 'Password berhasil diperbarui' };
};