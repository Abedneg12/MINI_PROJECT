import { PrismaClient } from '@prisma/client';
import { ICreateEventInput } from '../interfaces/event.interfaces';



const prisma = new PrismaClient();

//1. mengambil semua event
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

//2. mengambil event berdasarkan ID
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
};

//.3 membuat create event
export const createEvent = async (
  input: ICreateEventInput,
  organizer_id: number
) => {
  const newEvent = await prisma.event.create({
    data: {
      ...input,
      organizer_id,
      remaining_seats: input.total_seats,
    },
  });

  return newEvent;
};

//4. Update event
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

  //5. Update event
  const updated = await prisma.event.update({
    where: { id: eventId },
    data: {
      ...input,
    },
  });

  return updated;
};


//6. Detele Event
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
