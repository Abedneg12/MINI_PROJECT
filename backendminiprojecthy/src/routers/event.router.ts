import express from 'express';
import { getAllEventsController,getEventByIdController, createEventController, updateEventController, deleteEventController, searchEventsController } from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';



const router = express.Router();


// Public route – semua orang bisa lihat event
router.get('/search', searchEventsController); 
router.get('/', getAllEventsController);
router.get('/:id', getEventByIdController);

// Private Route
router.post('/create', authMiddleware, roleMiddleware('ORGANIZER'), createEventController);
router.put('/:id', authMiddleware, roleMiddleware('ORGANIZER'), updateEventController);
router.delete('/:id', authMiddleware, roleMiddleware('ORGANIZER'), deleteEventController);

export default router;