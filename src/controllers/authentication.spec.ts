import { Response, Request } from 'express';

import healthCheck from './authentication';

const mockResponse = (): Response => {
  const request = {} as any;

  request.status = (status: number) => {
    request.status = status;
    return request;
  };
  request.json = (object: any) => {
    request.json = object;
    return request;
  };

  return request;
};
const mockRequest = (): Request => {
  const request = {} as any;

  return request;
};

describe('authorisation controller', () => {
  describe('healthCheck', () => {
    it('should return 200 response with message "pong"', () => {
      const result = healthCheck(mockRequest(), mockResponse());

      expect(result.status).toBe(200);
      expect(JSON.stringify(result.json)).toBe(JSON.stringify({ message: 'pong' }));
    });
  });
});
