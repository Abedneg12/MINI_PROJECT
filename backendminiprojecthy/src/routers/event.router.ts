import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';
import { validateBody, validateParams, validateQuery } from '../middlewares/validate';
import { createEventSchema } from '../validations/createEventSchema';
import { z } from 'zod';
import * as EventController from '../controllers/event.controller';
import { Multer } from '../utils/multer';

const router = express.Router();
const upload = Multer('memoryStorage');

//////////////////////////////////////////////////////
router.get(
  '/',
  EventController.getAllEventsController
);

/////////////////////////////////////////////////////
const searchQuerySchema = z.object({
  keyword: z.string().min(1, { message: "Keyword tidak boleh kosong" }),
});
router.get(
  '/search',
  validateQuery(searchQuerySchema),
  EventController.searchEventController
);

////////////////////////////////////////////////////////
const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID harus angka").transform(Number),
});
router.get(
  '/:id',
  validateParams(idParamSchema),
  EventController.getEventByIdController
);

/////////////////////////////////////////////////////////
router.post(
  '/create',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  upload.single('image'),
  validateBody(createEventSchema),
  EventController.createEventController
);

/////////////////////////////////////////////////////////
router.put(
  '/update/:id',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  validateParams(idParamSchema),
  validateBody(createEventSchema),
  EventController.updateEventController
);

////////////////////////////////////////////////////////
router.patch(
  '/:id/image',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  validateParams(idParamSchema),
  upload.single('image'),
  EventController.updateEventImageController
);

////////////////////////////////////////////////////////
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  validateParams(idParamSchema),
  EventController.deleteEventController
);
/////////////////////////////////////////////////////////
export default router;
