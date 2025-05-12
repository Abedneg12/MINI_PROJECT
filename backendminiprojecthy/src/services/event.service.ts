import { PrismaClient } from '@prisma/client';
import { ICreateEventInput } from '../interfaces/event.interface';
import { EventCategory } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Mengambil semua event
export const getAllEvents = async () => {
  const events = await prisma.event.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      organizer: {
        select: {
          id: true,
          full_name: true,
          email: true,
        },
      },
    },
  });
  return events;
};

// 2. Mencari event berdasarkan keyword
export async function searchEvents(keyword: string) {
  if (!keyword.trim()) {
    throw new Error('Keyword tidak boleh kosong');
  }

  const lowered = keyword.toLowerCase();

  const isCategory = Object.values(EventCategory).some(
    (cat) => cat.toLowerCase() === lowered
  );
  const categoryFilter = isCategory
    ? [{ category: keyword.toUpperCase() as EventCategory }]
    : [];

  const events = await prisma.event.findMany({
    where: {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
        { location: { contains: keyword, mode: 'insensitive' } },
        ...categoryFilter,
      ],
    },
    orderBy: {
      start_date: 'asc',
    },
    include: {
      organizer: {
        select: {
          id: true,
          full_name: true,
          email: true,
        },
      },
    },
  });

  return events;
}

// 3. Mengambil event berdasarkan ID
export const getEventById = async (id: number) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organizer: {
        select: {
          id: true,
          full_name: true,
          email: true,
        },
      },
    },
  });

  if (!event) {
    throw new Error('Event tidak ditemukan');
  }

  return event;
}

// 4. Membuat event baru
export const createEvent = async (
  input: ICreateEventInput,
  organizer_id: number
) => {
  const newEvent = await prisma.event.create({
    data: {
      name: input.name,
      description: input.description,
      category: input.category,
      location: input.location,
      paid: input.paid,
      price: input.price,
      start_date: new Date(input.start_date),
      end_date: new Date(input.end_date),
      total_seats: input.total_seats,
      remaining_seats: input.total_seats,  // Set initial remaining_seats same as total_seats
      image_url: input.image_url || null,  // Store image URL if available
      organizer_id,
    },
  });

  return newEvent;
};

// 5. Update event
export const updateEvent = async (
  eventId: number,
  organizerId: number,
  input: Partial<ICreateEventInput>
) => {
  // Cek apakah event ada dan dimiliki oleh organizer ini
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.organizer_id !== organizerId) {
    throw new Error('Event tidak ditemukan atau bukan milik Anda');
  }

  const updated = await prisma.event.update({
    where: { id: eventId },
    data: {
      name: input.name || event.name,
      description: input.description || event.description,
      category: input.category || event.category,
      location: input.location || event.location,
      paid: input.paid ?? event.paid,  // Default to current value if not provided
      price: input.price ?? event.price,
      start_date: input.start_date ? new Date(input.start_date) : event.start_date,
      end_date: input.end_date ? new Date(input.end_date) : event.end_date,
      total_seats: input.total_seats ?? event.total_seats,
      remaining_seats: input.remaining_seats ?? event.remaining_seats,
      image_url: input.image_url || event.image_url,
    },
  });

  return updated;
};

// 6. Menghapus event
export const deleteEvent = async (eventId: number, organizerId: number) => {
  // Cek apakah event dimiliki oleh organizer
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.organizer_id !== organizerId) {
    throw new Error('Event tidak ditemukan atau bukan milik Anda');
  }

  // Hapus event
  await prisma.event.delete({
    where: { id: eventId },
  });

  return { message: 'Event berhasil dihapus' };
};
