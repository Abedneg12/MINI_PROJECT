"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    full_name: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['CUSTOMER', 'ORGANIZER']),
    referral_code: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email wajib diisi' })
        .email({ message: 'Format email tidak valid' }),
    password: zod_1.z
        .string({ required_error: 'Password wajib diisi' })
        .min(6, { message: 'Password minimal 6 karakter' }),
});
