import {z} from 'zod';

export const resetPasswordSchema = z.object({
    currentPassword: z.string().min(6, 'Password saat ini minimal 6 karakter'),
    newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
});


