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
exports.updateMyProfile = exports.getCustomerProfileService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const getCustomerProfileService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            full_name: true,
            email: true,
            referral_code: true,
            is_verified: true,
            profile_picture: true, // ✅ tambahkan ini
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
                            discount_type: true,
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
        profile_picture: user === null || user === void 0 ? void 0 : user.profile_picture,
        point: (user.points || []).reduce((acc, curr) => acc + curr.amount, 0),
        coupons: user.coupons,
        vouchers: user.transactions.map((tx) => tx.used_voucher),
    };
});
exports.getCustomerProfileService = getCustomerProfileService;
const updateMyProfile = (userId, input) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = {};
    if (input.full_name)
        updateData.full_name = input.full_name;
    if (input.profile_picture)
        updateData.profile_picture = input.profile_picture;
    if (input.password) {
        const hashed = yield bcrypt_1.default.hash(input.password, 10);
        updateData.password = hashed;
    }
    return prisma.user.update({
        where: { id: userId },
        data: updateData,
    });
});
exports.updateMyProfile = updateMyProfile;
