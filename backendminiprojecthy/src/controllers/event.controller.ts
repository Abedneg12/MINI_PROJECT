import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils.ts/response';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent} from '../services/event.service';
import { ICreateEventInput } from '../interfaces/event.interfaces';



//1. Controller menampilkan semua event
export const getAllEventsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await getAllEvents();
    successResponse(res, events, 'Daftar event berhasil diambil');
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal mengambil daftar event', 500);
  }
};

//2. Controller menampilkan event berdasarkan id
export const getEventByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID tidak valid' });
      return;
    }

    const event = await getEventById(id);
    successResponse(res, event, 'Detail event berhasil diambil');
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal mengambil detail event', 404);
  }
};

//3. Controller membuat event
export const createEventController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ORGANIZER') {
      res.status(403).json({
        success: false,
        message: 'Hanya organizer yang dapat membuat event',
      });
      return;
    }

    const input: ICreateEventInput = req.body;
    const newEvent = await createEvent(input, req.user.id);

    successResponse(res, newEvent, 'Event berhasil dibuat', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Gagal membuat event', 500);
  }
};


//4. Controller Update event
export const updateEventController = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = Number(req.params.id);
    const updated = await updateEvent(eventId, req.user!.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Event berhasil diperbarui',
      data: updated,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Gagal memperbarui event',
    });
  }
};


//5. delete event controller
export const deleteEventController = async (req: Request, res: Response) => {
  try {
    const eventId = Number(req.params.id);
    const result = await deleteEvent(eventId, req.user!.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Gagal menghapus event',
    });
  }
};