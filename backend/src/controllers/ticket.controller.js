const ticketService = require('../services/ticket.service');

const priorities = ['LOW', 'MEDIUM', 'HIGH'];

async function createTicket(req, res) {
try {
const { title, description, priority } = req.body;


if (
  typeof title !== 'string' ||
  typeof description !== 'string' ||
  !title.trim() ||
  !description.trim()
) {
  return res.status(400).json({
    message: 'Le titre et la description sont obligatoires.',
  });
}

if (title.trim().length > 200 || description.trim().length > 5000) {
  return res.status(400).json({
    message: 'Le titre ou la description est trop long.',
  });
}

if (priority !== undefined && !priorities.includes(priority)) {
  return res.status(400).json({
    message: 'Priorité invalide : LOW, MEDIUM ou HIGH.',
  });
}

const ticket = await ticketService.createTicket({
  title: title.trim(),
  description: description.trim(),
  priority,
  userId: req.user.id,
});

return res.status(201).json({
  message: 'Ticket créé avec succès.',
  ticket,
});


} catch (error) {
console.error('Erreur création ticket :', error);


return res.status(500).json({
  message: 'Impossible de créer le ticket.',
});


}
}

async function getMyTickets(req, res) {
try {
const tickets = await ticketService.getUserTickets(req.user.id);

return res.status(200).json({ tickets });


} catch (error) {
console.error('Erreur récupération tickets :', error);


return res.status(500).json({
  message: 'Impossible de récupérer les tickets.',
});


}
}

async function getTicketById(req, res) {
try {
const ticketId = Number(req.params.id);


if (!Number.isSafeInteger(ticketId) || ticketId <= 0) {
  return res.status(400).json({
    message: 'Identifiant de ticket invalide.',
  });
}

const ticket = await ticketService.getTicketById(
  ticketId,
  req.user.id,
  req.user.role
);

return res.status(200).json({ ticket });


} catch (error) {
if (error.statusCode) {
return res.status(error.statusCode).json({
message: error.message,
});
}


console.error('Erreur récupération ticket :', error);

return res.status(500).json({
  message: 'Impossible de récupérer le ticket.',
});


}
}


async function updateTicketStatus(req, res) {
  try {
    // Seuls les administrateurs peuvent modifier le statut.
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Accès interdit : seuls les administrateurs peuvent modifier le statut.',
      });
    }

    const ticketId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isSafeInteger(ticketId) || ticketId <= 0) {
      return res.status(400).json({
        message: 'Identifiant de ticket invalide.',
      });
    }

    const allowedStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Statut invalide : OPEN, IN_PROGRESS, RESOLVED ou CLOSED.',
      });
    }

    const existingTicket = await require('../config/prisma').ticket.findUnique({
      where: { id: ticketId },
    });

    if (!existingTicket) {
      return res.status(404).json({
        message: 'Ticket introuvable.',
      });
    }

    const updatedTicket = await require('../config/prisma').ticket.update({
      where: { id: ticketId },
      data: { status },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: 'Statut du ticket mis à jour avec succès.',
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error('Erreur modification statut :', error);

    return res.status(500).json({
      message: 'Impossible de modifier le statut du ticket.',
    });
  }
}

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  updateTicketStatus,
};

