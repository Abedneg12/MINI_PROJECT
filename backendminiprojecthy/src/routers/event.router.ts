import express from 'express';
import {
  getAllEventsController,
  getEventByIdController,
  createEventController,
  updateEventController,
  deleteEventController,
  searchEventsController,
  uploadEventImageController,
  deleteEventImageController,
} from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';
import { Multer } from '../utils/multer';

const router = express.Router();
const upload = Multer('memoryStorage');

// 🔓 Public Routes – bisa diakses siapa saja
router.get('/search', searchEventsController);        // Cari event
router.get('/', getAllEventsController);              // Ambil semua event
router.get('/:id', getEventByIdController);           // Ambil detail event berdasarkan ID

// 🔐 Private Routes – hanya untuk ORGANIZER
router.post('/create', authMiddleware, roleMiddleware('ORGANIZER'), createEventController);
router.put('/:id', authMiddleware, roleMiddleware('ORGANIZER'), updateEventController);
router.delete('/:id', authMiddleware, roleMiddleware('ORGANIZER'), deleteEventController);

// 📸 Upload dan Delete Gambar Event
router.patch(
  '/:id/upload-image',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  upload.single('image'),
  uploadEventImageController
);

router.delete(
  '/:id/delete-image',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  deleteEventImageController
);

export default router;
