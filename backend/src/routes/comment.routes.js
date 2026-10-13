
const express = require('express');
const commentController = require('../controllers/comment.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * /api/tickets/{id}/comments:
 *   post:
 *     summary: Ajouter un commentaire à un ticket
 *     tags: [Commentaires]
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Bonjour, je rencontre toujours ce problème.
 *     responses:
 *       '201':
 *         description: Commentaire créé avec succès
 *       '400':
 *         description: Données invalides
 *       '401':
 *         description: Authentification requise
 *       '403':
 *         description: Accès interdit à ce ticket
 *       '404':
 *         description: Ticket introuvable
 */

router.post('/:id/comments', commentController.createComment);

module.exports = router;
