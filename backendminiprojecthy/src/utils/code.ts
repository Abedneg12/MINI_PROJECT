export function generateTransactionCode(userId: number, eventId: number): string {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TICKET-${eventId}-${userId}-${random}`;
  }
  