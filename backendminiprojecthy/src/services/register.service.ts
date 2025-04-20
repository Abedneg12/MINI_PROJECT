import { PrismaClient } from '@prisma/client';
import { IRegisterInput } from '../interfaces/interfaces';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();

export const RegisterService = async (input: IRegisterInput) => {
  const { full_name, email, password, role, referral_code } = input;

  // 1. Cek apakah email sudah terdaftar
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email sudah terdaftar');
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Generate referral code unik
  const nameCode = full_name.split(' ')[0].toUpperCase();
  const newReferralCode = `REF-${nameCode}-${Date.now().toString().slice(-4)}`;

  // 4. Siapkan objek data user baru
  const newUserData: any = {
    full_name,
    email,
    password: hashedPassword,
    role,
    referral_code: newReferralCode,
  };

  // 5. Jika user mendaftar pakai referral code:
  let referrer = null;
  if (referral_code) {
    referrer = await prisma.user.findFirst({
      where: { referral_code: referral_code },
    });

    if (!referrer) {
      throw new Error('Kode referral tidak ditemukan');
    }
  }

  // 6. Buat user baru dulu
  const newUser = await prisma.user.create({ data: newUserData });

  // 7. Jika referral valid → berikan reward
  if (referrer) {
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);

    // 7.1. Tambah poin ke referrer
    await prisma.point.create({
      data: {
        user_id: referrer.id,
        amount: 10000,
        source: 'REFERRAL',
        expired_at: threeMonthsLater,
      },
    });

    // 7.2. Tambah kupon ke user baru
    await prisma.coupon.create({
      data: {
        user_id: newUser.id,
        code: `COUPON-${Date.now().toString().slice(-5)}`,
        discount_amount: 10000,
        expired_at: threeMonthsLater,
        is_used: false,
      },
    });

    // 7.3. Tambah ReferralLog
    await prisma.referralLog.create({
      data: {
        referred_by_id: referrer.id,
        referral_used_id: newUser.id,
      },
    });
  }

  return {
    message: 'Registrasi berhasil',
    user: {
      id: newUser.id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      referral_code: newUser.referral_code,
    },
  };
};