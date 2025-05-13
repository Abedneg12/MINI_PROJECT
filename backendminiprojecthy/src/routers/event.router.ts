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
import { createVoucherController } from '../controllers/voucher.controller';

const router = express.Router();
const upload = Multer('memoryStorage');

// 🔓 Public Routes – bisa diakses siapa saja
router.get('/search', searchEventController);          // Cari event
router.get('/', getAllEventsController);               // Ambil semua event
router.get('/:id', getEventByIdController);            // Ambil detail event berdasarkan ID

// 🔐 Private Routes – hanya untuk ORGANIZER
router.post(
  '/create',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  upload.single('image'), // ✅ upload gambar di create
  createEventController
);


router.post(
  '/:id/voucher',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  createVoucherController 
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  updateEventController
);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  deleteEventController
);

// 📸 Upload dan Delete Gambar Event
router.patch(
  '/:id/upload-image',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  upload.single('image'),
  updateEventImageController // ✅ sesuai nama fungsi sebenarnya
);

router.delete(
  '/:id/delete-image',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  deleteEventController // ✅ jika tersedia di controllermu
);

export default router;
