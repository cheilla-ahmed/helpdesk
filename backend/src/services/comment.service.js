
const prisma = require('../config/prisma');

async function createComment({ content, ticketId, userId }) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!ticket) {
    const error = new Error('Ticket introuvable.');
    error.statusCode = 404;
    throw error;
  }

  return prisma.comment.create({
    data: {
      content,
      ticketId,
      userId,
    },
    select: {
      id: true,
      content: true,
      ticketId: true,
      userId: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

module.exports = { createComment };
