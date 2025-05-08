"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("../controllers/event.controller");
const auth_1 = require("../middlewares/auth");
const role_1 = require("../middlewares/role");
const router = express_1.default.Router();
// Public route – semua orang bisa lihat event
router.get('/search', event_controller_1.searchEventsController);
router.get('/', event_controller_1.getAllEventsController);
router.get('/:id', event_controller_1.getEventByIdController);
// Private Route
router.post('/create', auth_1.authMiddleware, (0, role_1.roleMiddleware)('ORGANIZER'), event_controller_1.createEventController);
router.put('/:id', auth_1.authMiddleware, (0, role_1.roleMiddleware)('ORGANIZER'), event_controller_1.updateEventController);
router.delete('/:id', auth_1.authMiddleware, (0, role_1.roleMiddleware)('ORGANIZER'), event_controller_1.deleteEventController);
exports.default = router;
