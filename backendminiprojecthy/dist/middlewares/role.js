"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            res.status(403).json({
                success: false,
                message: 'Forbidden: Role tidak diizinkan',
            });
            return;
        }
        next();
    };
}
