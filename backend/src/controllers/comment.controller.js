
const commentService = require('../services/comment.service');
const prisma = require('../config/prisma');

async function createComment(req, res) {
  try {
    const ticketId = Number(req.params.id);
    const { content } = req.body;

    if (!Number.isSafeInteger(ticketId) || ticketId <= 0) {
      return res.status(400).json({
        message: 'Identifiant de ticket invalide.',
      });
    }

    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({
        message: 'Le commentaire est obligatoire.',
      });
    }

    if (content.trim().length > 3000) {
      return res.status(400).json({
        message: 'Le commentaire ne peut pas dépasser 3000 caractères.',
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true, userId: true },
    });

    if (!ticket) {
      return res.status(404).json({
        message: 'Ticket introuvable.',
      });
    }

    if (ticket.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Accès interdit à ce ticket.',
      });
    }

    const comment = await commentService.createComment({
      content: content.trim(),
      ticketId,
      userId: req.user.id,
    });

    return res.status(201).json({
      message: 'Commentaire ajouté avec succès.',
      comment,
    });
  } catch (error) {
    console.error('Erreur création commentaire :', error);

    return res.status(500).json({
      message: 'Impossible d’ajouter le commentaire.',
    });
  }
}

module.exports = { createComment };
