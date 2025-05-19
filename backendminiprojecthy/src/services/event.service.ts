import { PrismaClient, EventCategory, Prisma } from '@prisma/client';
import { ICreateEventInput } from '../interfaces/event.interface';

const prisma = new PrismaClient();


export const getAllEvents = async () => {
  return prisma.event.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      organizer: { select: { id: true, full_name: true, email: true } },
      vouchers: true,
    },
  });
};


export const getEventById = async (id: number) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organizer: { select: { id: true, full_name: true, email: true } },
      vouchers: true,
    },
  });

  if (!event) throw new Error('Event tidak ditemukan');
  return event;
};


export const searchEvents = async (keyword: string) => {
  if (!keyword.trim()) throw new Error('Keyword tidak boleh kosong');

  const lowered = keyword.toLowerCase();
  const isCategory = Object.values(EventCategory).some(
    (cat) => cat.toLowerCase() === lowered
  );

  const categoryFilter = isCategory
    ? [{ category: keyword.toUpperCase() as EventCategory }]
    : [];

  return prisma.event.findMany({
    where: {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
        { location: { contains: keyword, mode: 'insensitive' } },
        ...categoryFilter,
      ],
    },
    orderBy: { start_date: 'asc' },
    include: {
      organizer: { select: { id: true, full_name: true, email: true } },
      vouchers: true,
    },
  });
};


export const createEventWithVoucher = async (
  input: ICreateEventInput,
  imageUrl: string,
  voucherData?: {
    code: string;
    discount_amount: number;
    start_date: Date;
    end_date: Date;
  }
) => {
  return prisma.$transaction(async (tx) => {
    const event = await tx.event.create({
      data: {
        name: input.name,
        description: input.description,
        subtitle: input.subtitle,
        category: input.category,
        location: input.location,
        paid: input.paid,
        price: input.price,
        total_seats: input.total_seats,
        remaining_seats: input.total_seats,
        start_date: new Date(input.start_date),
        end_date: new Date(input.end_date),
        image_url: imageUrl,
        organizer_id: input.organizer_id,
      },
    });

    if (voucherData) {
      if (voucherData.start_date >= voucherData.end_date) {
        throw new Error('voucher_start harus sebelum voucher_end');
      }
      try {
        await tx.voucher.create({
          data: {
            event_id: event.id,
            code: voucherData.code,
            discount_amount: voucherData.discount_amount,
            start_date: voucherData.start_date,
            end_date: voucherData.end_date,
          },
        });
      } catch (error: any) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new Error('Kode voucher sudah digunakan');
        }
        throw error;
      }
    }

    const fullEvent = await tx.event.findUnique({
      where: { id: event.id },
      include: {
        organizer: { select: { id: true, full_name: true, email: true } },
        vouchers: true,
      },
    });

    return fullEvent!;
  });
};


export const updateEvent = async (
  eventId: number,
  organizerId: number,
  input: Partial<ICreateEventInput>
) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || event.organizer_id !== organizerId) {
    throw new Error('Event tidak ditemukan atau bukan milik Anda');
  }

  const updated = await prisma.event.update({
    where: { id: eventId },
    data: {
      name: input.name ?? event.name,
      description: input.description ?? event.description,
      subtitle: input.subtitle ?? event.subtitle,
      category: input.category ?? event.category,
      location: input.location ?? event.location,
      paid: input.paid ?? event.paid,
      price: input.price ?? event.price,
      total_seats: input.total_seats ?? event.total_seats,
      remaining_seats: input.remaining_seats ?? event.remaining_seats,
      start_date: input.start_date ? new Date(input.start_date) : event.start_date,
      end_date: input.end_date ? new Date(input.end_date) : event.end_date,
      image_url: input.image_url ?? event.image_url,
    },
  });

  return prisma.event.findUnique({
    where: { id: updated.id },
    include: {
      organizer: { select: { id: true, full_name: true, email: true } },
      vouchers: true,
    },
  });
};


export const updateEventImage = async (
  eventId: number,
  organizerId: number,
  imageUrl: string
) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || event.organizer_id !== organizerId) {
    throw new Error('Event tidak ditemukan atau bukan milik Anda');
  }

  const updated = await prisma.event.update({
    where: { id: eventId },
    data: { image_url: imageUrl },
  });

  return prisma.event.findUnique({
    where: { id: updated.id },
    include: {
      organizer: { select: { id: true, full_name: true, email: true } },
      vouchers: true,
    },
  });
};


export const deleteEvent = async (eventId: number, organizerId: number) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || event.organizer_id !== organizerId) {
    throw new Error('Event tidak ditemukan atau bukan milik Anda');
  }

  await prisma.event.delete({ where: { id: eventId } });
  return { message: 'Event berhasil dihapus' };
};
