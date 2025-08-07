import http from 'http';
import request from 'supertest';
import createServer from '../../src/server';
import { PORT } from '../../src/config';

// Mock dependencies for E2E tests
jest.mock('../../src/config', () => ({
  PORT: 3001, // Use different port for tests
  VALID_TOKENS: {
    'test-token': 'testuser'
  },
  COMPUTERS: [
    { name: 'testpc1', mac: '00:11:22:33:44:55' },
    { name: 'testpc2', mac: 'AA:BB:CC:DD:EE:FF' }
  ],
  PUBLIC_DIR: '../frontend/dist'
}));

jest.mock('wake_on_lan', () => ({
  wake: jest.fn()
}));

// Import server after mocking
let server: http.Server;

beforeAll(async () => {
  // Start test server
  server = createServer();
});

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  }
});

describe('Server E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should redirect to unauthorized page when no token provided', async () => {
      const response = await request(server)
        .get('/computers')
        .expect(302);

      expect(response.headers.location).toBe('/unauthorized');
    });

    it('should allow access with valid token', async () => {
      const response = await request(server)
        .get('/computers?token=test-token')
        .expect(200);

      expect(response.headers['content-type']).toContain('application/json');
    });

    it('should deny access with invalid token', async () => {
      const response = await request(server)
        .get('/computers?token=invalid-token')
        .expect(302);

      expect(response.headers.location).toBe('/unauthorized');
    });
  });

  describe('API Endpoints', () => {
    it('should return list of computers', async () => {
      const response = await request(server)
        .get('/computers?token=test-token')
        .expect(200);

      expect(response.body).toEqual(['testpc1', 'testpc2']);
    });

    it('should return user information', async () => {
      const response = await request(server)
        .get('/user?token=test-token')
        .expect(200);

      expect(response.body).toEqual({ name: 'testuser' });
    });

    it('should handle wake-on-LAN request', async () => {
      const wol = require('wake_on_lan');
      wol.wake.mockImplementation((mac: string, options: any, callback: (err: Error | null) => void) => {
        callback(null); // success
      });

      const response = await request(server)
        .get('/wake?computer=testpc1&token=test-token')
        .expect(200);

      expect(response.text).toContain('Wysłano magiczny pakiet WoL do testpc1');
      expect(response.text).toContain('testuser');
    });

    it('should return 400 for invalid computer', async () => {
      const response = await request(server)
        .get('/wake?computer=invalid&token=test-token')
        .expect(400);

      expect(response.text).toBe('Nieprawidłowy komputer');
    });
  });

  describe('Page Routes', () => {
    it('should serve index page', async () => {
      const response = await request(server)
        .get('/?token=test-token')
        .expect(200);

      expect(response.headers['content-type']).toContain('text/html');
    });

    it('should serve unauthorized page', async () => {
      const response = await request(server)
        .get('/unauthorized')
        .expect(401);

      expect(response.headers['content-type']).toContain('text/html');
    });
  });

  describe('Static Files', () => {
    it('should serve static files with file extensions', async () => {
      // This test would require actual static files to exist
      // For now, we'll test the 404 behavior
      const response = await request(server)
        .get('/nonexistent.js?token=test-token')
        .expect(404);

      expect(response.text).toBe('Nie znaleziono');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(server)
        .get('/unknown-route?token=test-token')
        .expect(404);

      expect(response.text).toBe('Nie znaleziono');
    });

    it('should handle malformed URLs gracefully', async () => {
      const response = await request(server)
        .get('/%invalid%url?token=test-token')
        .expect(404);

      expect(response.text).toBe('Nie znaleziono');
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array(3).fill(null).map(() =>
        request(server)
          .get('/computers?token=test-token')
          .expect(200)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.body).toEqual(['testpc1', 'testpc2']);
      });
    });
  });
}); 