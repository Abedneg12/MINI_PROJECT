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
exports.verifyEmailController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const response_1 = require("../utils/response");
const config_1 = require("../config");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecuresecret';
const verifyEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
        (0, response_1.errorResponse)(res, 'Token tidak ditemukan atau tidak valid', 400);
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = yield prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            (0, response_1.errorResponse)(res, 'User tidak ditemukan', 404);
            return;
        }
        if (user.is_verified) {
            return res.redirect(`${config_1.FE_PORT}/email-verified-success`);
        }
        yield prisma.user.update({
            where: { id: decoded.id },
            data: { is_verified: true },
        });
        return res.redirect(`${config_1.FE_PORT}/email-verified-success`);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 'Token tidak valid atau sudah kedaluwarsa', 401);
    }
});
exports.verifyEmailController = verifyEmailController;
