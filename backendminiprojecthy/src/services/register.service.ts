import { PrismaClient } from '@prisma/client';
import { IRegisterInput } from '../interfaces/interfaces';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/sendVerificationEmail';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecuresecret';

export const RegisterService = async (input: IRegisterInput) => {
  const { full_name, email, password, role, referral_code } = input;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email sudah terdaftar');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const nameCode = full_name.split(' ')[0].toUpperCase();
  const newReferralCode = `REF-${nameCode}-${Date.now().toString().slice(-4)}`;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Validasi referral jika digunakan
    let referrer = null;
    if (referral_code) {
      referrer = await tx.user.findFirst({
        where: { referral_code },
      });

      if (!referrer) {
        throw new Error('Kode referral tidak ditemukan');
      }
    }

    // 2. Buat user baru
    const newUser = await tx.user.create({
      data: {
        full_name,
        email,
        password: hashedPassword,
        role,
        referral_code: newReferralCode,
        is_verified: false, // 
      },
    });

    // 3. Jika referral valid, beri reward
    if (referrer) {
      const now = new Date();
      const expired = new Date();
      expired.setMonth(now.getMonth() + 3);

      await tx.point.create({
        data: {
          user_id: referrer.id,
          amount: 10000,
          source: 'REFERRAL',
          expired_at: expired,
        },
      });

      await tx.coupon.create({
        data: {
          user_id: newUser.id,
          code: `COUPON-${Date.now().toString().slice(-5)}`,
          discount_amount: 10000,
          expired_at: expired,
          is_used: false,
        },
      });

      await tx.referralLog.create({
        data: {
          referred_by_id: referrer.id,
          referral_used_id: newUser.id,
        },
      });
    }

    // 4. Buat token verifikasi
    const verifyToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5. Kirim email verifikasi
    const verificationLink = `http://localhost:5000/auth/verify?token=${verifyToken}`;
    await sendVerificationEmail(newUser.email, newUser.full_name, verificationLink);

    return {
      id: newUser.id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      referral_code: newUser.referral_code,
    };
  });

  return {
    message: 'Registrasi berhasil, silakan cek email untuk verifikasi akun.',
    user: result,
  };
};
