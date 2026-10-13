const prisma = require('../config/prisma');

async function createTicket({ title, description, priority, userId }) {
return prisma.ticket.create({
data: {
title,
description,
priority: priority || 'MEDIUM',
userId,
},
select: {
id: true,
title: true,
description: true,
status: true,
priority: true,
userId: true,
createdAt: true,
},
});
}

async function getUserTickets(userId) {
return prisma.ticket.findMany({
where: { userId },
orderBy: { createdAt: 'desc' },
select: {
id: true,
title: true,
description: true,
status: true,
priority: true,
createdAt: true,
updatedAt: true,
},
});
}

async function getTicketById(ticketId, userId, role) {
const ticket = await prisma.ticket.findUnique({
where: { id: ticketId },
include: {
user: {
select: { id: true, name: true, email: true },
},
comments: {
include: {
user: {
select: { id: true, name: true },
},
},
orderBy: { createdAt: 'asc' },
},
},
});

if (!ticket) {
const error = new Error('Ticket introuvable.');
error.statusCode = 404;
throw error;
}

if (ticket.userId !== userId && role !== 'ADMIN') {
const error = new Error('Accès interdit à ce ticket.');
error.statusCode = 403;
throw error;
}

return ticket;
}

module.exports = {
createTicket,
getUserTickets,
getTicketById,
};
