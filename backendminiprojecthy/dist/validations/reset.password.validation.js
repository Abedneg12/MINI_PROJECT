"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = void 0;
const zod_1 = require("zod");
exports.resetPasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(6, 'Password saat ini minimal 6 karakter'),
    newPassword: zod_1.z.string().min(6, 'Password baru minimal 6 karakter'),
});
