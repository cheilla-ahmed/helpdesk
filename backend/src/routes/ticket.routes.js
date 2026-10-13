const express = require('express');
const ticketController = require('../controllers/ticket.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/requireAdmin');

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Créer un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Problème de connexion Wi-Fi
 *               description:
 *                 type: string
 *                 example: Je n'arrive plus à me connecter au réseau du bureau.
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: HIGH
 *     responses:
 *       '201':
 *         description: Ticket créé avec succès
 *       '400':
 *         description: Données invalides
 *       '401':
 *         description: Authentification requise
 */

router.post('/', ticketController.createTicket);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Récupérer les tickets de l'utilisateur connecté
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Liste des tickets récupérée
 *       '401':
 *         description: Authentification requise
 */

router.get('/', ticketController.getMyTickets);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Consulter un ticket et ses commentaires
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du ticket
 *     responses:
 *       '200':
 *         description: Détails du ticket récupérés
 *       '401':
 *         description: Authentification requise
 *       '403':
 *         description: Accès interdit à ce ticket
 *       '404':
 *         description: Ticket introuvable
 */

router.get('/:id', ticketController.getTicketById);

/**
 * @swagger
 * /api/tickets/{id}/status:
 *   patch:
 *     summary: Modifier le statut d'un ticket
 *     description: Cette opération est réservée aux administrateurs.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [OPEN, IN_PROGRESS, RESOLVED, CLOSED]
 *                 example: RESOLVED
 *     responses:
 *       '200':
 *         description: Statut du ticket modifié avec succès
 *       '400':
 *         description: Statut invalide
 *       '401':
 *         description: Authentification requise
 *       '403':
 *         description: Accès réservé aux administrateurs
 *       '404':
 *         description: Ticket introuvable
 */

router.patch(
  '/:id/status',
  requireAdmin,
  ticketController.updateTicketStatus
);

module.exports = router;
