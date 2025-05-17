import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';
import { getMyEventsController, updateMyEventController } from '../controllers/event.organizer.controller';


const router = express.Router();

router.get(
    '/my',
    authMiddleware,
    roleMiddleware('ORGANIZER'),
    getMyEventsController
  );

router.put(
    '/update/:id',
    authMiddleware,
    roleMiddleware('ORGANIZER'),
    updateMyEventController
  );


export  default router;

