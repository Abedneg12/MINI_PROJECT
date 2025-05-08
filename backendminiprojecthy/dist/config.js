"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_SECRET = exports.CLOUDINARY_KEY = exports.CLOUDINARY_NAME = exports.FE_PORT = exports.JWT_SECRET = exports.PORT = void 0;
require("dotenv/config");
_a = process.env, exports.PORT = _a.PORT, exports.JWT_SECRET = _a.JWT_SECRET, exports.FE_PORT = _a.FE_PORT, exports.CLOUDINARY_NAME = _a.CLOUDINARY_NAME, exports.CLOUDINARY_KEY = _a.CLOUDINARY_KEY, exports.CLOUDINARY_SECRET = _a.CLOUDINARY_SECRET;
