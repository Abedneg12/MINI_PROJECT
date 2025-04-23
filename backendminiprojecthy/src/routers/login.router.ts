import express from 'express';
import { LoginController } from '../controllers/login.controller';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../validations/auth.validation';

const router = express.Router();

router.post('/login', validate(loginSchema), LoginController);

export default router;