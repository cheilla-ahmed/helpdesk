const request = require('supertest');
const app = require('../src/app');

describe('Authentification des routes tickets', () => {
  it('devrait refuser l’accès à la liste des tickets sans token', async () => {
    const response = await request(app).get('/api/tickets');

    expect(response.status).toBe(401);
  });
});

  it('devrait refuser l’accès avec un token invalide', async () => {
    const response = await request(app)
      .get('/api/tickets')
      .set('Authorization', 'Bearer faux-token-invalide');

    expect(response.status).toBe(401);
  });