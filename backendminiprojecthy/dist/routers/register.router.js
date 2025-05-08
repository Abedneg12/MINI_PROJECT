"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_controller_1 = require("../controllers/register.controller");
const validate_1 = require("../middlewares/validate");
const auth_validation_1 = require("../validations/auth.validation");
const router = express_1.default.Router();
router.post('/register', (0, validate_1.validate)(auth_validation_1.registerSchema), register_controller_1.RegisterController);
exports.default = router;
