"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("../controllers/profile.controller");
const auth_1 = require("../middlewares/auth");
const role_1 = require("../middlewares/role");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.patch('/reset-password', auth_1.authMiddleware, profile_controller_1.resetPasswordController);
// GET Profil Customer
router.get('/me/customer', auth_1.authMiddleware, (0, role_1.roleMiddleware)('CUSTOMER'), profile_controller_1.getCustomerProfileController);
// PUT Update Profil Customer
router.put('/update', auth_1.authMiddleware, profile_controller_1.updateMyProfileController);
// PATCH Upload Foto Profil Customer
router.patch('/customer/upload-picture', auth_1.authMiddleware, (0, role_1.roleMiddleware)('CUSTOMER'), (0, multer_1.Multer)('memoryStorage').single('profile_picture'), profile_controller_1.uploadProfilePictureController);
router.patch('/customer/delete-picture', auth_1.authMiddleware, (0, role_1.roleMiddleware)('CUSTOMER'), profile_controller_1.deleteProfilePictureController);
exports.default = router;
