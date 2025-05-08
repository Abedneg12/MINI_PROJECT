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
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getAllEvents = void 0;
exports.searchEvents = searchEvents;
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
//1. mengambil semua event
const getAllEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield prisma.event.findMany({
        orderBy: { created_at: 'desc' },
        include: {
            organizer: {
                select: {
                    id: true,
                    full_name: true,
                    email: true,
                },
            },
        },
    });
    return events;
});
exports.getAllEvents = getAllEvents;
//2. mengambil event berdasarkan keyword
function searchEvents(keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!keyword.trim()) {
            throw new Error('Keyword tidak boleh kosong');
        }
        const lowered = keyword.toLowerCase();
        const isCategory = Object.values(client_2.EventCategory).some(cat => cat.toLowerCase() === lowered);
        const categoryFilter = isCategory
            ? [{ category: keyword.toUpperCase() }]
            : [];
        const events = yield prisma.event.findMany({
            where: {
                OR: [
                    { name: { contains: keyword, mode: 'insensitive' } },
                    { description: { contains: keyword, mode: 'insensitive' } },
                    { location: { contains: keyword, mode: 'insensitive' } },
                    ...categoryFilter,
                ],
            },
            orderBy: {
                start_date: 'asc',
            },
            include: {
                organizer: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                    },
                },
            },
        });
        return events;
    });
}
//3. mengambil event berdasarkan ID
const getEventById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield prisma.event.findUnique({
        where: { id },
        include: {
            organizer: {
                select: {
                    id: true,
                    full_name: true,
                    email: true,
                },
            },
        },
    });
    if (!event) {
        throw new Error('Event tidak ditemukan');
    }
    return event;
});
exports.getEventById = getEventById;
//4. membuat create event
const createEvent = (input, organizer_id) => __awaiter(void 0, void 0, void 0, function* () {
    const newEvent = yield prisma.event.create({
        data: Object.assign(Object.assign({}, input), { organizer_id, remaining_seats: input.total_seats }),
    });
    return newEvent;
});
exports.createEvent = createEvent;
//5. Update event
const updateEvent = (eventId, organizerId, input) => __awaiter(void 0, void 0, void 0, function* () {
    // Cek apakah event ada dan dimiliki oleh organizer ini
    const event = yield prisma.event.findUnique({
        where: { id: eventId },
    });
    if (!event || event.organizer_id !== organizerId) {
        throw new Error('Event tidak ditemukan atau bukan milik Anda');
    }
    const updated = yield prisma.event.update({
        where: { id: eventId },
        data: Object.assign({}, input),
    });
    return updated;
});
exports.updateEvent = updateEvent;
//6. Detele Event
const deleteEvent = (eventId, organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    // Cek apakah event dimiliki oleh organizer
    const event = yield prisma.event.findUnique({
        where: { id: eventId },
    });
    if (!event || event.organizer_id !== organizerId) {
        throw new Error('Event tidak ditemukan atau bukan milik Anda');
    }
    // 8. Hapus event
    yield prisma.event.delete({
        where: { id: eventId },
    });
    return { message: 'Event berhasil dihapus' };
});
exports.deleteEvent = deleteEvent;
