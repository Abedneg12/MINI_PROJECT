import express from 'express';
import { RegisterController} from '../controllers/register.controller';

const router = express.Router();

// [POST] /auth/register
router.post('/register', RegisterController);


export default router;