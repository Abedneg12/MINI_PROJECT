import { Response, NextFunction } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents,
} from '../services/event.service';
import {
  uploadEventImageService,
  deleteEventImageService,
} from '../services/eventImage.service';
import { ICreateEventInput } from '../interfaces/event.interface';
import { AuthRequest } from '../middlewares/auth';

// 1. Menampilkan semua event
export const getAllEventsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const events = await getAllEvents();
    successResponse(res, events, 'Daftar event berhasil diambil');
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal mengambil daftar event', 500);
  }
};

// 2. Mencari event berdasarkan keyword
export const searchEventsController = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { keyword } = req.query;

    if (!keyword || typeof keyword !== 'string') {
      errorResponse(res, 'Keyword harus disediakan dalam query params.', 400);
      return;
    }

    const events = await searchEvents(keyword);
    successResponse(res, events, 'Pencarian event berhasil');
  } catch (error) {
    errorResponse(res, (error as Error).message || 'Gagal mencari event', 500);
  }
};

// 3. Mendapatkan event berdasarkan ID
export const getEventByIdController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      errorResponse(res, 'ID tidak valid', 400);
      return;
    }

    const event = await getEventById(id);
    successResponse(res, event, 'Detail event berhasil diambil');
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal mengambil detail event', 404);
  }
};

// 4. Membuat event
export const createEventController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ORGANIZER') {
      errorResponse(res, 'Hanya organizer yang dapat membuat event', 403);
      return;
    }

    const input: ICreateEventInput = req.body;
    const newEvent = await createEvent(input, req.user.id);
    successResponse(res, newEvent, 'Event berhasil dibuat', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal membuat event', 500);
  }
};

// 5. Memperbarui event
export const updateEventController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = Number(req.params.id);
    const updated = await updateEvent(eventId, req.user!.id, req.body);
    successResponse(res, updated, 'Event berhasil diperbarui');
  } catch (err: any) {
    errorResponse(res, err.message || 'Gagal memperbarui event', 400);
  }
};

// 6. Menghapus event
export const deleteEventController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = Number(req.params.id);
    const result = await deleteEvent(eventId, req.user!.id);
    successResponse(res, result, 'Event berhasil dihapus');
  } catch (err: any) {
    errorResponse(res, err.message || 'Gagal menghapus event', 400);
  }
};

// 7. Upload foto event
export const uploadEventImageController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = Number(req.params.id);
    const file = req.file;

    if (!file) {
      errorResponse(res, 'File gambar tidak ditemukan', 400);
      return;
    }

    const updatedEvent = await uploadEventImageService(eventId, file, req.user!.id);
    successResponse(res, updatedEvent, 'Gambar event berhasil diupload');
  } catch (err: any) {
    errorResponse(res, err.message || 'Gagal upload gambar', 500);
  }
};

// 8. Hapus foto event
export const deleteEventImageController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = Number(req.params.id);
    const result = await deleteEventImageService(eventId, req.user!.id);
    successResponse(res, result, 'Gambar event berhasil dihapus');
  } catch (err: any) {
    errorResponse(res, err.message || 'Gagal menghapus gambar event', 500);
  }
};
