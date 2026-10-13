const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('devrait retourner le statut 200 et confirmer que l’API fonctionne', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'OK',
      message: 'HelpDesk API is running',
    });
  });
});