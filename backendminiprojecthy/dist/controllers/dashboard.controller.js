"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const getDashboard = (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Welcome to Organizer Dashboard',
        user: req.user,
    });
};
exports.getDashboard = getDashboard;
