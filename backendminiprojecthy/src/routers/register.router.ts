import express from 'express';
import { RegisterController } from '../controllers/register.controller';
import { validate } from '../middlewares/validate';
import { registerSchema } from '../validations/auth.validation';

const router = express.Router();

router.post('/register', validate(registerSchema), RegisterController);

export default router;
