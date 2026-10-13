const request = require('supertest');

jest.mock('../src/services/ticket.service', () => ({
  createTicket: jest.fn(),
  getUserTickets: jest.fn(),
  getTicketById: jest.fn(),
}));

const app = require('../src/app');
const jwt = require('jsonwebtoken');
const ticketService = require('../src/services/ticket.service');

describe('Validation de création des tickets', () => {

    beforeEach(() => {
    jest.clearAllMocks();
  });

    const adminToken = jwt.sign(
    { userId: 1, role: 'ADMIN' },
    process.env.JWT_SECRET || 'secret-de-test'
  );


  const token = jwt.sign(
    { userId: 123, role: 'USER' },
    process.env.JWT_SECRET || 'secret-de-test'
  );

  it('devrait refuser la création si le titre est absent', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Description du ticket de test',
        priority: 'MEDIUM',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Le titre et la description sont obligatoires.'
    );
    expect(ticketService.createTicket).not.toHaveBeenCalled();
  });


  it('devrait créer un ticket avec des données valides', async () => {
    const ticketCree = {
      id: 99,
      title: 'Ticket de test',
      description: 'Description du ticket de test',
      priority: 'MEDIUM',
      status: 'OPEN',
      userId: 123,
    };

    ticketService.createTicket.mockResolvedValue(ticketCree);

    const response = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '  Ticket de test  ',
        description: '  Description du ticket de test  ',
        priority: 'MEDIUM',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Ticket créé avec succès.');
    expect(response.body.ticket).toEqual(ticketCree);

    expect(ticketService.createTicket).toHaveBeenCalledWith({
      title: 'Ticket de test',
      description: 'Description du ticket de test',
      priority: 'MEDIUM',
      userId: 123,
    });
  });

    it('devrait refuser une priorité invalide', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Ticket de test',
        description: 'Description du ticket de test',
        priority: 'URGENT',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Priorité invalide : LOW, MEDIUM ou HIGH.'
    );
    expect(ticketService.createTicket).not.toHaveBeenCalled();
  });


  it('devrait refuser une description trop longue', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Ticket de test',
        description: 'A'.repeat(5001),
        priority: 'MEDIUM',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Le titre ou la description est trop long.'
    );
    expect(ticketService.createTicket).not.toHaveBeenCalled();
  });


  it('devrait refuser un titre trop long', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'A'.repeat(201),
        description: 'Description du ticket de test',
        priority: 'MEDIUM',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Le titre ou la description est trop long.'
    );
    expect(ticketService.createTicket).not.toHaveBeenCalled();
  });

  
  it('devrait refuser l’accès au ticket d’un autre utilisateur', async () => {
    ticketService.getTicketById.mockRejectedValue({
      statusCode: 403,
      message: 'Accès interdit à ce ticket.',
    });

    const response = await request(app)
      .get('/api/tickets/99')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'Accès interdit à ce ticket.'
    );

    expect(ticketService.getTicketById).toHaveBeenCalledWith(
      99,
      123,
      'USER'
    );
  });

 
  it('devrait interdire à un utilisateur normal de modifier le statut', async () => {
    const response = await request(app)
      .patch('/api/tickets/99/status')
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'RESOLVED',
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'Accès interdit : seuls les administrateurs peuvent modifier le statut.'
    );
  });


  it('devrait permettre à un administrateur de modifier le statut', async () => {
    const adminToken = jwt.sign(
      { userId: 1, role: 'ADMIN' },
      process.env.JWT_SECRET || 'secret-de-test'
    );

    const prisma = require('../src/config/prisma');

    const ticketMisAJour = {
      id: 99,
      title: 'Ticket de test',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      updatedAt: new Date('2026-01-01T10:00:00Z'),
    };

    const findUniqueSpy = jest
      .spyOn(prisma.ticket, 'findUnique')
      .mockResolvedValue({ id: 99 });

    const updateSpy = jest
      .spyOn(prisma.ticket, 'update')
      .mockResolvedValue(ticketMisAJour);

    try {
      const response = await request(app)
        .patch('/api/tickets/99/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'RESOLVED' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'Statut du ticket mis à jour avec succès.'
      );
      expect(response.body.ticket.status).toBe('RESOLVED');

      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 99 },
          data: { status: 'RESOLVED' },
        })
      );
    } finally {
      findUniqueSpy.mockRestore();
      updateSpy.mockRestore();
    }
  });

  
  it('devrait refuser un statut invalide', async () => {
    const response = await request(app)
      .patch('/api/tickets/99/status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'URGENT',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Statut invalide : OPEN, IN_PROGRESS, RESOLVED ou CLOSED.'
    );
  });

  
  it('devrait renvoyer 404 si le ticket à modifier n’existe pas', async () => {
    const prisma = require('../src/config/prisma');

    const findUniqueSpy = jest
      .spyOn(prisma.ticket, 'findUnique')
      .mockResolvedValue(null);

    try {
      const response = await request(app)
        .patch('/api/tickets/999/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'RESOLVED',
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Ticket introuvable.');
    } finally {
      findUniqueSpy.mockRestore();
    }
  });



  });