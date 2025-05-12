import { cloudinaryUpload, cloudinaryRemove } from "../utils/cloudinary";
import prisma from "../lib/prisma";

/**
 * Upload gambar event baru
 */
export const uploadEventImageService = async (
  eventId: number,
  file: Express.Multer.File,
  organizerId: number
) => {
  // Cek apakah event dimiliki oleh organizer
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event || event.organizer_id !== organizerId) {
    throw new Error("Event tidak ditemukan atau bukan milik Anda");
  }

  // Upload gambar ke Cloudinary
  const result = await cloudinaryUpload(file);

  // Update event dengan URL gambar
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: { image_url: result.secure_url },
  });

  return updatedEvent;
};

/**
 * Update foto event: hapus lama → upload baru
 */
export const updateEventImageService = async (
  eventId: number,
  file: Express.Multer.File,
  organizerId: number
) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event || event.organizer_id !== organizerId) {
    throw new Error("Event tidak ditemukan atau bukan milik Anda");
  }

  // Hapus foto lama jika ada
  if (event.image_url) {
    await cloudinaryRemove(event.image_url);
  }

  // Upload gambar baru
  const result = await cloudinaryUpload(file);

  // Update database
  const updated = await prisma.event.update({
    where: { id: eventId },
    data: { image_url: result.secure_url },
  });

  return updated;
};

/**
 * Hapus foto event (Cloudinary + DB)
 */
export const deleteEventImageService = async (
  eventId: number,
  organizerId: number
) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event || event.organizer_id !== organizerId) {
    throw new Error("Event tidak ditemukan atau bukan milik Anda");
  }

  if (!event.image_url) {
    throw new Error("Event tidak memiliki gambar");
  }

  // Hapus dari Cloudinary
  await cloudinaryRemove(event.image_url);

  // Kosongkan image_url di DB
  await prisma.event.update({
    where: { id: eventId },
    data: { image_url: null },
  });

  return { message: "Gambar event berhasil dihapus" };
};
