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
exports.LoginService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecuresecret';
const LoginService = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = input;
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Email tidak ditemukan');
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Password salah');
    }
    // Generate token JWT
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role,
    }, JWT_SECRET, { expiresIn: '7d' });
    return {
        message: 'Login berhasil',
        token,
        user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            referral_code: user.referral_code,
            profile_picture: user.profile_picture
        },
    };
});
exports.LoginService = LoginService;
