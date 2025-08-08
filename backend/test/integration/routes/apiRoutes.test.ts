import { IncomingMessage, ServerResponse } from 'http';
import { handleApiRoutes } from '../../../src/routes/apiRoutes';

// Mock dependencies
jest.mock('../../../src/config', () => ({
  COMPUTERS: [
    { name: 'testpc1', mac: '00:11:22:33:44:55' },
    { name: 'testpc2', mac: 'AA:BB:CC:DD:EE:FF' }
  ]
}));

jest.mock('wake_on_lan', () => ({
  wake: jest.fn()
}));

// Helper function to create mock request
function createMockRequest(method: string, url: string): IncomingMessage {
  return {
    method,
    url,
  } as IncomingMessage;
}

// Helper function to create mock response
function createMockResponse(): ServerResponse {
  const res = {} as ServerResponse;
  res.writeHead = jest.fn();
  res.end = jest.fn();
  return res;
}

describe('ApiRoutes Integration', () => {
  let mockRes: ServerResponse;

  beforeEach(() => {
    mockRes = createMockResponse();
    jest.clearAllMocks();
  });

  describe('GET /api/computers', () => {
    it('should return list of computers', async () => {
      const mockReq = createMockRequest('GET', '/api/computers');
      
      const result = await handleApiRoutes(mockReq, mockRes, '/api/computers', 'testuser');
      
      expect(result).toBe(true);
      expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
      expect(mockRes.end).toHaveBeenCalledWith('[{"name":"testpc1","id":"testpc1"},{"name":"testpc2","id":"testpc2"}]');
    });
  });

  describe('GET /api/user', () => {
    it('should return user information', async () => {
      const mockReq = createMockRequest('GET', '/api/user');
      
      const result = await handleApiRoutes(mockReq, mockRes, '/api/user', 'testuser');
      
      expect(result).toBe(true);
      expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
      expect(mockRes.end).toHaveBeenCalledWith('{"name":"testuser"}');
    });
  });

  describe('GET /api/wake', () => {
    it('should handle successful wake-on-LAN', async () => {
      const wol = require('wake_on_lan');
      wol.wake.mockImplementation((mac: string, options: any, callback: (err: Error | null) => void) => {
        callback(null); // success
      });

      const mockReq = createMockRequest('GET', '/api/wake?computer=testpc1');
      
      const result = await handleApiRoutes(mockReq, mockRes, '/api/wake', 'testuser');
      
      expect(result).toBe(true);
      expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'text/plain' });
      expect(mockRes.end).toHaveBeenCalledWith(expect.stringContaining('Wysłano magiczny pakiet WoL do testpc1'));
    });

    it('should handle invalid computer', async () => {
      const mockReq = createMockRequest('GET', '/api/wake?computer=invalid');
      
      const result = await handleApiRoutes(mockReq, mockRes, '/api/wake', 'testuser');
      
      expect(result).toBe(true);
      expect(mockRes.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'text/plain' });
      expect(mockRes.end).toHaveBeenCalledWith('Nieprawidłowy komputer');
    });

    it('should handle WoL failure', async () => {
      const wol = require('wake_on_lan');
      wol.wake.mockImplementation((mac: string, options: any, callback: (err: Error | null) => void) => {
        callback(new Error('Network error')); // failure
      });

      const mockReq = createMockRequest('GET', '/api/wake?computer=testpc1');
      
      const result = await handleApiRoutes(mockReq, mockRes, '/api/wake', 'testuser');
      
      expect(result).toBe(true);
      expect(mockRes.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'text/plain' });
      expect(mockRes.end).toHaveBeenCalledWith('Błąd wysłania Wake-on-LAN');
    });
  });

  describe('Unhandled routes', () => {
    it('should return false for unknown routes', async () => {
      const mockReq = createMockRequest('GET', '/unknown');
      
      const result = await handleApiRoutes(mockReq, mockRes, '/unknown', 'testuser');
      
      expect(result).toBe(false);
      expect(mockRes.writeHead).not.toHaveBeenCalled();
      expect(mockRes.end).not.toHaveBeenCalled();
    });

    it('should return false for POST requests', async () => {
      const mockReq = createMockRequest('POST', '/api/computers');
      
      const result = await handleApiRoutes(mockReq, mockRes, '/api/computers', 'testuser');
      
      expect(result).toBe(false);
    });
  });
}); 