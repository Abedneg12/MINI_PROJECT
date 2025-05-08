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
exports.RegisterController = void 0;
const register_service_1 = require("../services/register.service");
const response_1 = require("../utils/response");
const RegisterController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        const result = yield (0, register_service_1.RegisterService)(input);
        (0, response_1.successResponse)(res, result.user, result.message, 201);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message || 'Terjadi kesalahan saat registrasi');
    }
});
exports.RegisterController = RegisterController;
