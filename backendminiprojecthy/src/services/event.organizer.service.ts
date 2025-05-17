import prisma from "../lib/prisma";
import { ICreateEventInput } from "../interfaces/event.interface";


export const getEventsByOrganizer = async (organizerId: number) => {
  return prisma.event.findMany({
    where: { organizer_id: organizerId },
    orderBy: { created_at: 'desc' },
    include: {
      organizer: {
        select: {
          id: true,
          full_name: true,
          email: true,
        },
      },
      vouchers: true,
    },
  });
};

export const updateEventByOrganizer = async (
  organizerId: number,
  eventId: number,
  input: Partial<ICreateEventInput>
) => {
  const { count } = await prisma.event.updateMany({
    where: { id: eventId, organizer_id: organizerId },
    data: {
      name: input.name,
      description: input.description,
      subtitle: input.subtitle,
      category: input.category,
      location: input.location,
      paid: input.paid,
      price: input.price,
      total_seats: input.total_seats,
      start_date: input.start_date ? new Date(input.start_date) : undefined,
      end_date: input.end_date ? new Date(input.end_date) : undefined,
      image_url: input.image_url,
    },
  });

  if (count === 0) {
    throw new Error('Event tidak ditemukan atau bukan milik Anda');
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      organizer: { select: { id: true, full_name: true, email: true } },
      vouchers: true,
    },
  });

  return event!;
};
