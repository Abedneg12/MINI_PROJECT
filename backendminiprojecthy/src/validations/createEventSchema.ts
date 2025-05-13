import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(6),
  description: z.string().min(10),
  subtitle: z.string().min(5),
  category: z.enum(["FESTIVAL", "MUSIC", "ART", "EDUCATION"]),
  location: z.string().min(5),
  paid: z.boolean(),
  price: z.number().nonnegative(),
  start_date: z.string(),
  end_date: z.string(),
  total_seats: z.number().min(1),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;
