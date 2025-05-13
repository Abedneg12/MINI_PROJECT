import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { createEventSchema } from '../validations/createEventSchema';
import { AuthRequest } from '../middlewares/auth';
import * as EventService from '../services/event.service';
import { cloudinaryUpload } from '../utils/cloudinary';

// GET /events
export const getAllEventsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await EventService.getAllEvents();
    successResponse(res, events, 'Berhasil mengambil semua event');
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal mengambil event', 500);
  }
};

// GET /events/:id
export const getEventByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = Number(req.params.id);
    const event = await EventService.getEventById(eventId);
    successResponse(res, event, 'Berhasil mengambil event');
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal mengambil event', 404);
  }
};

// GET /events/search?keyword=...
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

    // Ubah tipe data dari string ke tipe yang sesuai
    const formattedBody = {
      ...req.body,
      subtitle: req.body.subtitle,
      paid: req.body.paid === 'true',
      price: Number(req.body.price),
      total_seats: Number(req.body.total_seats),
    };

    const parsed = createEventSchema.safeParse(formattedBody);
    if (!parsed.success) {
      errorResponse(res, parsed.error.errors[0].message, 400);
      return;
    }

    const image = await cloudinaryUpload(req.file);

    const newEvent = await EventService.createEvent(
      {
        ...parsed.data,
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date),
        organizer_id: organizerId,
      },
      organizerId,
      image.secure_url
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

// PUT /events/:id
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

// DELETE /events/:id
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
