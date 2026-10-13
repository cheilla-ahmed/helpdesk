const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Créer un compte utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jean Test
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean.test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: Exemple123!
 *     responses:
 *       '201':
 *         description: Compte créé avec succès
 *       '400':
 *         description: Données invalides
 *       '409':
 *         description: Adresse e-mail déjà utilisée
 */


router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecter un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean.test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Exemple123!
 *     responses:
 *       '200':
 *         description: Connexion réussie, retourne le token JWT et l'utilisateur
 *       '400':
 *         description: Données invalides
 *       '401':
 *         description: E-mail ou mot de passe incorrect
 */

router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *       401:
 *         description: Authentification requise ou token invalide
 *       404:
 *         description: Utilisateur introuvable
 */


router.get('/me', authenticateToken, authController.getMe);


module.exports = router;
