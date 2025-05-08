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
exports.deleteEventController = exports.updateEventController = exports.createEventController = exports.getEventByIdController = exports.searchEventsController = exports.getAllEventsController = void 0;
const response_1 = require("../utils/response");
const event_service_1 = require("../services/event.service");
//1. Controller menampilkan semua event
const getAllEventsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield (0, event_service_1.getAllEvents)();
        (0, response_1.successResponse)(res, events, 'Daftar event berhasil diambil');
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message || 'Gagal mengambil daftar event', 500);
    }
});
exports.getAllEventsController = getAllEventsController;
//2. Controller menampilkan semua event berdasarkan keyword
const searchEventsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword } = req.query;
        if (!keyword || typeof keyword !== 'string') {
            (0, response_1.errorResponse)(res, 'Keyword harus disediakan dalam query params.', 400);
            return;
        }
        const events = yield (0, event_service_1.searchEvents)(keyword);
        (0, response_1.successResponse)(res, events, 'Pencarian event berhasil');
    }
    catch (error) {
        console.error(error);
        (0, response_1.errorResponse)(res, error.message || 'Gagal mencari event', 500);
    }
});
exports.searchEventsController = searchEventsController;
//3. Controller menampilkan event berdasarkan id
const getEventByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'ID tidak valid' });
            return;
        }
        const event = yield (0, event_service_1.getEventById)(id);
        (0, response_1.successResponse)(res, event, 'Detail event berhasil diambil');
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message || 'Gagal mengambil detail event', 404);
    }
});
exports.getEventByIdController = getEventByIdController;
//4. Controller membuat event
const createEventController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'ORGANIZER') {
            res.status(403).json({
                success: false,
                message: 'Hanya organizer yang dapat membuat event',
            });
            return;
        }
        const input = req.body;
        const newEvent = yield (0, event_service_1.createEvent)(input, req.user.id);
        (0, response_1.successResponse)(res, newEvent, 'Event berhasil dibuat', 201);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message || 'Gagal membuat event', 500);
    }
});
exports.createEventController = createEventController;
//5. Controller Update event
const updateEventController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = Number(req.params.id);
        const updated = yield (0, event_service_1.updateEvent)(eventId, req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Event berhasil diperbarui',
            data: updated,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message || 'Gagal memperbarui event',
        });
    }
});
exports.updateEventController = updateEventController;
//6. delete event controller
const deleteEventController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = Number(req.params.id);
        const result = yield (0, event_service_1.deleteEvent)(eventId, req.user.id);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message || 'Gagal menghapus event',
        });
    }
});
exports.deleteEventController = deleteEventController;
