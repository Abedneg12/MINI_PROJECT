import { EventCategory } from "@prisma/client";

export interface ICreateEventInput {
  name: string;
  description: string;
  category: EventCategory;
  location: string;
  paid: boolean;         // Menandakan apakah event berbayar
  price: number;         // Harga tiket, jika event berbayar
  start_date: Date;
  end_date: Date;
  total_seats: number;   // Jumlah total tempat duduk
  remaining_seats: number;  // Jumlah tempat duduk yang tersisa (diatur sama dengan total_seats pada pembuatan)
  image_url?: string;    // URL gambar, dapat null jika tidak ada gambar (opsional)
  organizer_id: number;  // ID organizer, relasi ke User
}