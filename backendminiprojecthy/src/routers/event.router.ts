import express from 'express';
import { getAllEventsController,getEventByIdController, createEventController, updateEventController, deleteEventController } from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';



const router = express.Router();


// Public route – semua orang bisa lihat event
router.get('/all', getAllEventsController);
router.get('/:id', getEventByIdController);

// Protected route (Only ORGANIZER can create event)
router.post('/create', authMiddleware, roleMiddleware('ORGANIZER'), createEventController);
router.put('/update/:id', authMiddleware, roleMiddleware('ORGANIZER'), updateEventController);
router.delete('/delete/:id', authMiddleware, roleMiddleware('ORGANIZER'), deleteEventController);
export default router;