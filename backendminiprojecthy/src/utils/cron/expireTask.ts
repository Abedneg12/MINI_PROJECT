// src/cron/expireTask.ts

import cron from 'node-cron';
import prisma from '../../lib/prisma';

export function startExpireCronJob() {
  // Jalankan setiap hari jam 00:00 (jam 12 malam)
  cron.schedule('0 0 * * *', async () => {
    const now = new Date();

    console.log('Menjalankan cron job untuk cek Coupon dan Point expired');

    try {
      // Expire Coupon: jika sudah lewat expired_at dan belum digunakan
      const expiredCoupons = await prisma.coupon.updateMany({
        where: {
          expired_at: { lt: now },
          is_used: false,
        },
        data: { is_used: true },
      });

      // Expire Point: jika sudah lewat expired_at
      const expiredPoints = await prisma.point.updateMany({
        where: {
          expired_at: { lt: now },
          amount: { gt: 0 },
        },
        data: { amount: 0 }, // atau bisa tambahkan is_expired: true jika field ada
      });

      console.log(`Expired coupons: ${expiredCoupons.count}`);
      console.log(`Expired points: ${expiredPoints.count}`);
    } catch (err) {
      console.error('Gagal menjalankan cron job expired:', err);
    }
  });
}
