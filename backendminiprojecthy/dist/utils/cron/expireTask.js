"use strict";
// src/cron/expireTask.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExpireCronJob = startExpireCronJob;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
function startExpireCronJob() {
    // Jalankan setiap hari jam 00:00 (jam 12 malam)
    node_cron_1.default.schedule('0 0 * * *', () => __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        console.log('Menjalankan cron job untuk cek Coupon dan Point expired');
        try {
            // Expire Coupon: jika sudah lewat expired_at dan belum digunakan
            const expiredCoupons = yield prisma_1.default.coupon.updateMany({
                where: {
                    expired_at: { lt: now },
                    is_used: false,
                },
                data: { is_used: true },
            });
            // Expire Point: jika sudah lewat expired_at
            const expiredPoints = yield prisma_1.default.point.updateMany({
                where: {
                    expired_at: { lt: now },
                    amount: { gt: 0 },
                },
                data: { amount: 0 }, // atau bisa tambahkan is_expired: true jika field ada
            });
            console.log(`Expired coupons: ${expiredCoupons.count}`);
            console.log(`Expired points: ${expiredPoints.count}`);
        }
        catch (err) {
            console.error('Gagal menjalankan cron job expired:', err);
        }
    }));
}
