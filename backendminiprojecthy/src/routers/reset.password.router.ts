import { resetPasswordController } from "../controllers/reset.password.controller";
import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { resetPasswordSchema } from '../validations/reset.password.validation';
const router = express.Router();


router.patch(
'/reset-password',
validate(resetPasswordSchema),
authMiddleware, 
resetPasswordController);


export default router;