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
exports.LoginController = void 0;
const login_service_1 = require("../services/login.service");
const response_1 = require("../utils/response");
const LoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, login_service_1.LoginService)(req.body);
        (0, response_1.successResponse)(res, {
            token: result.token,
            user: result.user,
        }, result.message);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message || 'Login gagal', 401);
    }
});
exports.LoginController = LoginController;
