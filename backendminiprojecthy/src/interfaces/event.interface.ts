import { EventCategory } from '@prisma/client';
export interface ICreateEventInput {
  name: string;
  description: string;
  subtitle: string;
  category: EventCategory;
  location: string;
  paid: boolean;
  price: number;
  start_date: Date;
  end_date: Date;
  total_seats: number;
  remaining_seats?: number; 
  image_url?: string;
  organizer_id: number;
}
