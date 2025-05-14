import express from 'express';
import {
  createEventController,
  deleteEventController,
  getAllEventsController,
  getEventByIdController,
  searchEventController,
  updateEventController,
  updateEventImageController,
} from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';
import { Multer } from '../utils/multer';

const router = express.Router();
const upload = Multer('memoryStorage');

// 🔓 Public Routes
router.get('/search', searchEventController);
router.get('/', getAllEventsController);
router.get('/:id', getEventByIdController);

// 🔐 Private Routes (ORGANIZER only)
router.post(
  '/create',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  upload.single('image'),
  createEventController
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  updateEventController
);

router.patch(
  '/:id/upload-image',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  upload.single('image'),
  updateEventImageController
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  deleteEventController
);

export default router;
