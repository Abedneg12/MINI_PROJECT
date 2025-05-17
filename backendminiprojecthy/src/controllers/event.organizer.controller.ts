import { AuthRequest } from "../middlewares/auth";
import { Response, NextFunction } from "express";
import { getEventsByOrganizer, updateEventByOrganizer} from "../services/event.organizer.service"
import { successResponse } from "../utils/response";

export const getMyEventsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const organizerId = req.user!.id;
    const events = await getEventsByOrganizer(organizerId);
    successResponse(res, events, 'Berhasil mengambil event Anda');
  } catch (err) {
    next(err);
  }
};


export const updateMyEventController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const organizerId = req.user!.id;
      const eventId = Number(req.params.id);
      const updated = await updateEventByOrganizer(
        organizerId,
        eventId,
        req.body
      );
      successResponse(res, updated, 'Event berhasil diperbarui');
    } catch (err) {
      next(err);
    }
  };
  