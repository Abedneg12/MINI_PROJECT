import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as EventService from '../services/event.service';
import { successResponse, errorResponse } from '../utils/response';
import { cloudinaryUpload } from '../utils/cloudinary';


export const getAllEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await EventService.getAllEvents();
    successResponse(res, events, 'Berhasil mengambil semua event');
  } catch (err) {
    next(err);
  }
};


export const getEventByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const event = await EventService.getEventById(id);
    successResponse(res, event, 'Berhasil mengambil event');
  } catch (err) {
    next(err);
  }
};


export const searchEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const keyword = String(req.query.keyword || '');
    const results = await EventService.searchEvents(keyword);
    successResponse(res, results, 'Berhasil mencari event');
  } catch (err) {
    next(err);
  }
};


export const createEventController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const organizerId = req.user!.id;
    if (!req.file) {
      errorResponse(res, 'Gambar event wajib diunggah', 400);
      return;
    }

    const image = await cloudinaryUpload(req.file);

    const {
      voucher_code,
      voucher_discount,
      voucher_start,
      voucher_end,
      ...payload
    } = req.body;
    const voucherData = voucher_code
      ? {
          code: voucher_code,
          discount_amount: Number(voucher_discount),
          start_date: new Date(voucher_start),
          end_date: new Date(voucher_end),
        }
      : undefined;

    const input = {
      ...payload,
      start_date: new Date(payload.start_date),
      end_date: new Date(payload.end_date),
      total_seats: Number(payload.total_seats),
      price: Number(payload.price),
      paid: Boolean(payload.paid),
      organizer_id: organizerId,
    };

    const newEvent = await EventService.createEventWithVoucher(
      input,
      image.secure_url,
      voucherData
    );
    successResponse(res, newEvent, 'Event berhasil dibuat');
  } catch (err) {
    next(err);
  }
};


export const updateEventController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const organizerId = req.user!.id;
    const eventId = Number(req.params.id);
    const updated = await EventService.updateEvent(
      eventId,
      organizerId,
      req.body
    );
    successResponse(res, updated, 'Event berhasil diperbarui');
  } catch (err) {
    next(err);
  }
};


export const updateEventImageController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const organizerId = req.user!.id;
    const eventId = Number(req.params.id);
    if (!req.file) {
      errorResponse(res, 'File gambar tidak ditemukan', 400);
      return;
    }

    const image = await cloudinaryUpload(req.file);
    const updated = await EventService.updateEventImage(
      eventId,
      organizerId,
      image.secure_url
    );
    successResponse(res, updated, 'Gambar event berhasil diperbarui');
  } catch (err) {
    next(err);
  }
};


export const deleteEventController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const organizerId = req.user!.id;
    const eventId = Number(req.params.id);
    await EventService.deleteEvent(eventId, organizerId);
    successResponse(res, null, 'Event berhasil dihapus');
  } catch (err) {
    next(err);
  }
};
