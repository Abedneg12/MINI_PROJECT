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
exports.resetPasswordService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const resetPasswordService = (userId, input) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error('User tidak ditemukan');
    const isMatch = yield bcrypt_1.default.compare(input.currentPassword, user.password);
    if (!isMatch)
        throw new Error('Password saat ini salah');
    const hashedNewPassword = yield bcrypt_1.default.hash(input.newPassword, 10);
    yield prisma_1.default.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
    });
    return { message: 'Password berhasil diperbarui' };
});
exports.resetPasswordService = resetPasswordService;
