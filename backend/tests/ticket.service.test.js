
jest.mock('../src/config/prisma', () => ({
  ticket: {
    findUnique: jest.fn(),
  },
}));

const prisma = require('../src/config/prisma');
const ticketService = require('../src/services/ticket.service');

describe('Sécurité du service des tickets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait refuser l’accès au ticket d’un autre utilisateur', async () => {
    prisma.ticket.findUnique.mockResolvedValue({
      id: 99,
      title: 'Ticket privé',
      userId: 456,
      comments: [],
    });

    await expect(
      ticketService.getTicketById(99, 123, 'USER')
    ).rejects.toMatchObject({
      statusCode: 403,
      message: 'Accès interdit à ce ticket.',
    });
  });


  it('devrait autoriser le propriétaire à consulter son ticket', async () => {
    const ticket = {
      id: 99,
      title: 'Mon ticket',
      userId: 123,
      comments: [],
    };

    prisma.ticket.findUnique.mockResolvedValue(ticket);

    await expect(
      ticketService.getTicketById(99, 123, 'USER')
    ).resolves.toEqual(ticket);

    expect(prisma.ticket.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 99 },
      })
    );
  });

 
  it('devrait autoriser un administrateur à consulter le ticket d’un autre utilisateur', async () => {
    const ticket = {
      id: 99,
      title: 'Ticket d’un autre utilisateur',
      userId: 456,
      comments: [],
    };

    prisma.ticket.findUnique.mockResolvedValue(ticket);

    await expect(
      ticketService.getTicketById(99, 123, 'ADMIN')
    ).resolves.toEqual(ticket);
  });


  it('devrait renvoyer une erreur 404 si le ticket n’existe pas', async () => {
    prisma.ticket.findUnique.mockResolvedValue(null);

    await expect(
      ticketService.getTicketById(999, 123, 'USER')
    ).rejects.toMatchObject({
      statusCode: 404,
      message: 'Ticket introuvable.',
    });
  });



});
