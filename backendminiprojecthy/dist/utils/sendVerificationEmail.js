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
exports.transporter = void 0;
exports.sendVerificationEmail = sendVerificationEmail;
// src/utils/mailer.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
    },
});
function sendVerificationEmail(email, name, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const templatePath = path_1.default.join(process.cwd(), 'src', 'templates', 'verify-email.hbs');
        const source = fs_1.default.readFileSync(templatePath, 'utf8');
        const template = handlebars_1.default.compile(source);
        const verifyUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
        const html = template({ name, link: verifyUrl });
        yield exports.transporter.sendMail({
            from: `"FindYourTicket" <${process.env.NODEMAILER_EMAIL}>`,
            to: email,
            subject: 'Verifikasi Akun Anda',
            html,
        });
    });
}
