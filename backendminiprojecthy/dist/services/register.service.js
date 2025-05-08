"use strict";
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
exports.RegisterService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendVerificationEmail_1 = require("../utils/sendVerificationEmail");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecuresecret';
const RegisterService = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { full_name, email, password, role, referral_code } = input;
    const existingUser = yield prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('Email sudah terdaftar');
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const nameCode = full_name.split(' ')[0].toUpperCase();
    const newReferralCode = `REF-${nameCode}-${Date.now().toString().slice(-4)}`;
    const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Validasi referral jika digunakan
        let referrer = null;
        if (referral_code) {
            referrer = yield tx.user.findFirst({
                where: { referral_code },
            });
            if (!referrer) {
                throw new Error('Kode referral tidak ditemukan');
            }
        }
        // 2. Buat user baru
        const newUser = yield tx.user.create({
            data: {
                full_name,
                email,
                password: hashedPassword,
                role,
                referral_code: newReferralCode,
                is_verified: false, // ← Penting!
            },
        });
        // 3. Jika referral valid, beri reward
        if (referrer) {
            const now = new Date();
            const expired = new Date();
            expired.setMonth(now.getMonth() + 3);
            yield tx.point.create({
                data: {
                    user_id: referrer.id,
                    amount: 10000,
                    source: 'REFERRAL',
                    expired_at: expired,
                },
            });
            yield tx.coupon.create({
                data: {
                    user_id: newUser.id,
                    code: `COUPON-${Date.now().toString().slice(-5)}`,
                    discount_amount: 10000,
                    expired_at: expired,
                    is_used: false,
                },
            });
            yield tx.referralLog.create({
                data: {
                    referred_by_id: referrer.id,
                    referral_used_id: newUser.id,
                },
            });
        }
        // 4. Buat token verifikasi
        const verifyToken = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });
        // 5. Kirim email verifikasi
        const verificationLink = `http://localhost:5000/auth/verify?token=${verifyToken}`;
        yield (0, sendVerificationEmail_1.sendVerificationEmail)(newUser.email, newUser.full_name, verificationLink);
        return {
            id: newUser.id,
            full_name: newUser.full_name,
            email: newUser.email,
            role: newUser.role,
            referral_code: newUser.referral_code,
        };
    }));
    return {
        message: 'Registrasi berhasil, silakan cek email untuk verifikasi akun.',
        user: result,
    };
});
exports.RegisterService = RegisterService;
