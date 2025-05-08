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
exports.updatePictureService = updatePictureService;
const prisma_1 = __importDefault(require("../lib/prisma"));
const cloudinary_1 = require("../utils/cloudinary");
function updatePictureService(userId, file) {
    return __awaiter(this, void 0, void 0, function* () {
        let uploadedUrl = '';
        try {
            const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new Error('User tidak ditemukan');
            // ⬅️ Upload dulu di luar transaction
            const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(file);
            uploadedUrl = secure_url;
            yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield tx.user.update({
                    where: { id: userId },
                    data: { profile_picture: secure_url },
                });
            }));
            return { message: 'Foto profil berhasil diupdate', secure_url };
        }
        catch (error) {
            if (uploadedUrl)
                yield (0, cloudinary_1.cloudinaryRemove)(uploadedUrl); // rollback file jika error
            throw error;
        }
    });
}
