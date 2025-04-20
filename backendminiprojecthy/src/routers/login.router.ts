import express from 'express';
import { LoginController } from '../controllers/login.controller';

const router = express.Router();

// [POST] /auth/login
router.post('/login', LoginController);

export default router;