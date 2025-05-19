import { z } from "zod";

export const createEventSchema = z
  .object({
    name: z.string().min(6, { message: "Nama event minimal 6 karakter" }),
    description: z.string().min(10, { message: "Deskripsi minimal 10 karakter" }),
    subtitle: z.string().min(5, { message: "Subtitle minimal 5 karakter" }),
    category: z.enum(["FESTIVAL", "MUSIC", "ART", "EDUCATION"]),
    location: z.string().min(5, { message: "Lokasi minimal 5 karakter" }),

   
    paid: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
    price: z.preprocess((val) => Number(val), z.number().nonnegative({ message: "Harga tidak boleh negatif" })),
    total_seats: z.preprocess((val) => Number(val), z.number().int().min(1, { message: "Total seats minimal 1" })),

    start_date: z
      .string()
      .refine((s) => !isNaN(Date.parse(s)), { message: "Format start_date tidak valid" }),
    end_date: z
      .string()
      .refine((s) => !isNaN(Date.parse(s)), { message: "Format end_date tidak valid" }),

    // Opsional voucher
    voucher_code: z.string().optional(),
    voucher_discount: z
      .preprocess((val) => Number(val), z.number().int().nonnegative())
      .optional(),
    voucher_start: z.string().optional(),
    voucher_end: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paid && data.price <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Harga harus > 0 untuk event berbayar",
        path: ["price"],
      });
    }
    if (!data.paid && data.price !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Harga harus 0 untuk event gratis",
        path: ["price"],
      });
    }

    const start = Date.parse(data.start_date);
    const end = Date.parse(data.end_date);
    if (!isNaN(start) && !isNaN(end) && start >= end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "start_date harus sebelum end_date",
        path: ["start_date"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "end_date harus setelah start_date",
        path: ["end_date"],
      });
    }
  });
