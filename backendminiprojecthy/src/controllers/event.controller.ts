import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse } from '../utils/response'
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, searchEvents} from '../services/event.service';
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


//2. Controller menampilkan semua event berdasarkan keyword
export const searchEventsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyword } = req.query;

    if (!keyword || typeof keyword !== 'string') {
      errorResponse(res, 'Keyword harus disediakan dalam query params.', 400);
      return;
    }

    const events = await searchEvents(keyword);

    successResponse(res, events, 'Pencarian event berhasil');
  } catch (error) {
    console.error(error);
    errorResponse(res, (error as Error).message || 'Gagal mencari event', 500);
  }
};



//3. Controller menampilkan event berdasarkan id
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

//4. Controller membuat event
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


//5. Controller Update event
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


//6. delete event controller
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