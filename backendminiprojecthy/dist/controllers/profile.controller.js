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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyProfileController = exports.deleteProfilePictureController = exports.uploadProfilePictureController = exports.getCustomerProfileController = void 0;
const profile_service_1 = require("../services/profile.service");
const response_1 = require("../utils/response");
const updateCustomerPictureService_1 = require("../services/updateCustomerPictureService"); // ✅ pakai service baru
const deleteCustomerPictureService_1 = require("../services/deleteCustomerPictureService");
// Ambil Data Profile
const getCustomerProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            (0, response_1.errorResponse)(res, 'Unauthorized', 401);
            return;
        }
        const profile = yield (0, profile_service_1.getCustomerProfileService)(userId);
        (0, response_1.successResponse)(res, profile, 'Berhasil mengambil profil customer');
    }
    catch (err) {
        (0, response_1.errorResponse)(res, err.message || 'Gagal mengambil profil customer', 500);
    }
});
exports.getCustomerProfileController = getCustomerProfileController;
//  Upload Foto Profil
const uploadProfilePictureController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            (0, response_1.errorResponse)(res, 'Unauthorized', 401);
            return;
        }
        if (!req.file) {
            (0, response_1.errorResponse)(res, 'File tidak ditemukan', 400);
            return;
        }
        const result = yield (0, updateCustomerPictureService_1.updatePictureService)(userId, req.file);
        (0, response_1.successResponse)(res, { url: result.secure_url }, result.message);
    }
    catch (err) {
        (0, response_1.errorResponse)(res, err.message || 'Gagal upload foto', 500);
    }
});
exports.uploadProfilePictureController = uploadProfilePictureController;
const deleteProfilePictureController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const result = yield (0, deleteCustomerPictureService_1.deleteCustomerPictureService)(userId);
        res.status(200).json({ success: true, message: result.message });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Gagal menghapus foto profil',
        });
    }
});
exports.deleteProfilePictureController = deleteProfilePictureController;
const updateMyProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield (0, profile_service_1.updateMyProfile)(req.user.id, req.body);
        (0, response_1.successResponse)(res, updatedUser, 'Profil berhasil diperbarui');
    }
    catch (err) {
        (0, response_1.errorResponse)(res, err.message || 'Gagal memperbarui profil', 500);
    }
});
exports.updateMyProfileController = updateMyProfileController;
