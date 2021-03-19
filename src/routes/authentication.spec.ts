import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

chai.use(chaiHttp);

describe('authentication', () => {
  it('should return "Endpoint does not exist" with 404 status code when endpoint does not exit', async () => {
    const response = await chai.request(app).get('/non/existing/endpoint');

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: 'Endpoint does not exist' });
  });

  describe('/ping', () => {
    it('should return "pong" with 200 status code when authentication is healthy', async () => {
      const response = await chai.request(app).get('/authentication/ping');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ message: 'pong' });
    });
  });
});
