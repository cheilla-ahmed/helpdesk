
require('dotenv').config();
const request = require('supertest');

jest.mock('../src/services/comment.service', () => ({
  createComment: jest.fn(),
}));

jest.mock('../src/config/prisma', () => ({
  ticket: {
    findUnique: jest.fn(),
  },
}));

const app = require('../src/app');
const jwt = require('jsonwebtoken');
const prisma = require('../src/config/prisma');
const commentService = require('../src/services/comment.service');

describe('Validation des commentaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const token = jwt.sign(
    { userId: 123, role: 'USER' },
    process.env.JWT_SECRET || 'secret-de-test'
  );

  it('devrait refuser un commentaire vide', async () => {
    const response = await request(app)
      .post('/api/tickets/99/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '   ',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Le commentaire est obligatoire.'
    );

    expect(prisma.ticket.findUnique).not.toHaveBeenCalled();
    expect(commentService.createComment).not.toHaveBeenCalled();
  });

 
it('devrait refuser un identifiant de ticket invalide', async () => {
  const response = await request(app)
    .post('/api/tickets/abc/comments')
    .set('Authorization', `Bearer ${token}`)
    .send({
      content: 'Voici un commentaire de test.',
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    'Identifiant de ticket invalide.'
  );

  expect(prisma.ticket.findUnique).not.toHaveBeenCalled();
  expect(commentService.createComment).not.toHaveBeenCalled();
});


it('devrait refuser un commentaire de plus de 3000 caractères', async () => {
  const response = await request(app)
    .post('/api/tickets/99/comments')
    .set('Authorization', `Bearer ${token}`)
    .send({
      content: 'a'.repeat(3001),
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    'Le commentaire ne peut pas dépasser 3000 caractères.'
  );

  expect(prisma.ticket.findUnique).not.toHaveBeenCalled();
  expect(commentService.createComment).not.toHaveBeenCalled();
});


it('devrait renvoyer 404 si le ticket n’existe pas', async () => {
  prisma.ticket.findUnique.mockResolvedValue(null);

  const response = await request(app)
    .post('/api/tickets/99/comments')
    .set('Authorization', `Bearer ${token}`)
    .send({
      content: 'Voici un commentaire de test.',
    });

  expect(response.status).toBe(404);
  expect(response.body.message).toBe('Ticket introuvable.');

  expect(prisma.ticket.findUnique).toHaveBeenCalledWith({
    where: { id: 99 },
    select: { id: true, userId: true },
  });

  expect(commentService.createComment).not.toHaveBeenCalled();
});


it('devrait refuser un commentaire sur le ticket d’un autre utilisateur', async () => {
  prisma.ticket.findUnique.mockResolvedValue({
    id: 99,
    userId: 456,
  });

  const response = await request(app)
    .post('/api/tickets/99/comments')
    .set('Authorization', `Bearer ${token}`)
    .send({
      content: 'Voici un commentaire de test.',
    });

  expect(response.status).toBe(403);
  expect(response.body.message).toBe(
    'Accès interdit à ce ticket.'
  );

  expect(commentService.createComment).not.toHaveBeenCalled();
});


it('devrait créer un commentaire valide', async () => {
  prisma.ticket.findUnique.mockResolvedValue({
    id: 99,
    userId: 123,
  });

  const commentaireCree = {
    id: 1,
    content: 'Mon commentaire de test.',
    ticketId: 99,
    userId: 123,
  };

  commentService.createComment.mockResolvedValue(commentaireCree);

  const response = await request(app)
    .post('/api/tickets/99/comments')
    .set('Authorization', `Bearer ${token}`)
    .send({
      content: '  Mon commentaire de test.  ',
    });

  expect(response.status).toBe(201);
  expect(response.body.message).toBe(
    'Commentaire ajouté avec succès.'
  );
  expect(response.body.comment).toEqual(commentaireCree);

  expect(commentService.createComment).toHaveBeenCalledWith({
    content: 'Mon commentaire de test.',
    ticketId: 99,
    userId: 123,
  });
});





});
