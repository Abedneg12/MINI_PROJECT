"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const role_1 = require("../middlewares/role");
const router = express_1.default.Router();
router.get('/dashboard', auth_1.authMiddleware, (0, role_1.roleMiddleware)('ORGANIZER'), (req, res) => {
    const authReq = req;
    res.status(200).json({
        success: true,
        message: 'Welcome to Organizer Dashboard',
        user: authReq.user,
    });
});
exports.default = router;
