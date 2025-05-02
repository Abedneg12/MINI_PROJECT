import { PrismaClient } from '@prisma/client';
import { IRegisterInput } from '../interfaces/interfaces';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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