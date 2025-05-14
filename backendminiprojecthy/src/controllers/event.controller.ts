import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { createEventSchema } from '../validations/createEventSchema';
import { AuthRequest } from '../middlewares/auth';
import { ticketArraySchema} from '../validations/ticketSchema';
import * as EventService from '../services/event.service';
import { cloudinaryUpload } from '../utils/cloudinary';


export const getAllEventsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await EventService.getAllEvents();
    successResponse(res, events, 'Berhasil mengambil semua event');
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal mengambil event', 500);
  }
};


export const getEventByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = Number(req.params.id);
    const event = await EventService.getEventById(eventId);
    successResponse(res, event, 'Berhasil mengambil event');
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal mengambil event', 404);
  }
};

// GET /events/search?keyword=
export const searchEventController = async (req: Request, res: Response): Promise<void> => {
  try {
    const keyword = String(req.query.keyword || '');
    const results = await EventService.searchEvents(keyword);
    successResponse(res, results, 'Berhasil mencari event');
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal mencari event', 400);
  }
};

export const createEventController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const organizerId = req.user?.id;
    if (!organizerId) {
      errorResponse(res, 'Unauthorized', 401);
      return;
    }

    if (!req.file) {
      errorResponse(res, 'Gambar event wajib diunggah', 400);
      return;
    }

    // Parse JSON array tickets jika dikirim dari frontend (FormData)
    let parsedTickets = [];
    if (req.body.tickets) {
      try {
        parsedTickets = JSON.parse(req.body.tickets);
      } catch {
        errorResponse(res, 'Format tiket tidak valid (harus JSON)', 400);
        return;
      }
    }

    const formattedBody = {
      ...req.body,
      paid: req.body.paid === 'true',
      price: Number(req.body.price),
      total_seats: Number(req.body.total_seats),
      tickets: parsedTickets,
    };

    const parsed = createEventSchema.safeParse(formattedBody);
    if (!parsed.success) {
      errorResponse(res, parsed.error.errors[0].message, 400);
      return;
    }

    // Validasi tiket jika ada
    if (parsedTickets.length > 0) {
      const ticketsValid = ticketArraySchema.safeParse(parsedTickets);
      if (!ticketsValid.success) {
        errorResponse(res, ticketsValid.error.errors[0].message, 400);
        return;
      }
    }

    const image = await cloudinaryUpload(req.file);

    const hasVoucher =
      req.body.voucher_code &&
      req.body.voucher_discount &&
      req.body.voucher_start &&
      req.body.voucher_end;

    const voucherData = hasVoucher
      ? {
          code: req.body.voucher_code,
          discount_amount: Number(req.body.voucher_discount),
          start_date: new Date(req.body.voucher_start),
          end_date: new Date(req.body.voucher_end),
        }
      : undefined;

    const ticketsData = parsedTickets.length > 0 ? parsedTickets.map((t: any) => ({
      type: t.type,
      price: Number(t.price),
      quantity: Number(t.quantity),
      description: t.description || '',
    })) : undefined;

    const newEvent = await EventService.createEventWithVoucher(
      {
        ...parsed.data,
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date),
        organizer_id: organizerId,
      },
      image.secure_url,
      voucherData,
      ticketsData
    );

    successResponse(res, newEvent, 'Event berhasil dibuat');
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal membuat event', 500);
  }
};

export const updateEventImageController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = Number(req.params.id);
    const organizerId = req.user?.id;

    if (!req.file) {
      errorResponse(res, 'File gambar tidak ditemukan', 400);
      return;
    }

    const image = await cloudinaryUpload(req.file);
    const updated = await EventService.updateEventImage(eventId, organizerId!, image.secure_url);
    successResponse(res, updated, 'Gambar event berhasil diperbarui');
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal memperbarui gambar event', 500);
  }
};

export const updateEventController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = Number(req.params.id);
    const organizerId = req.user?.id;

    const updated = await EventService.updateEvent(eventId, organizerId!, req.body);
    successResponse(res, updated, 'Event berhasil diperbarui');
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal memperbarui event', 500);
  }
};

export const deleteEventController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = Number(req.params.id);
    const organizerId = req.user?.id;

    const result = await EventService.deleteEvent(eventId, organizerId!);
    successResponse(res, null, result.message);
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal menghapus event', 500);
  }
};
