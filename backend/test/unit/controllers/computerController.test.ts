import { getComputers, wakeComputer } from '../../../src/controllers/computerController';
import { SuccessObject, SuccessMessage, Error } from '../../../src/utils/ControllerResult';
import { getQueryParam } from '../../../src/utils/urlParser';

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

describe('ComputerController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getComputers', () => {
    it('should return list of computer objects', () => {
      const result = getComputers();

      expect(result).toBeInstanceOf(SuccessObject);
      expect(result.getStatusCode()).toBe(200);
      expect(result.getContentType()).toBe('application/json');
      
      const body = JSON.parse(result.getBody());
      expect(body).toEqual([
        { name: 'testpc1', id: 'testpc1' },
        { name: 'testpc2', id: 'testpc2' }
      ]);
    });
  });

  describe('wakeComputer', () => {
    it('should return error for invalid computer', async () => {
      const result = await wakeComputer('?computer=invalid', 'testuser');

      expect(result).toBeInstanceOf(Error);
      expect(result.getStatusCode()).toBe(400);
      expect(result.getBody()).toBe('Nieprawidłowy komputer');
    });

    it('should return error for missing computer parameter', async () => {
      const result = await wakeComputer('', 'testuser');

      expect(result).toBeInstanceOf(Error);
      expect(result.getStatusCode()).toBe(400);
    });

    it('should return success for valid computer by name', async () => {
      // Debug: sprawdź co zwraca getQueryParam
      console.log('getQueryParam result:', getQueryParam('?computer=testpc1', 'computer'));
      
      const wol = require('wake_on_lan');
      wol.wake.mockImplementation((mac: string, options: any, callback: (err: Error | null) => void) => {
        console.log('Mock wol.wake called with:', mac, options);
        callback(null); // success
      });

      const result = await wakeComputer('?computer=testpc1', 'testuser');
      
      console.log('Result:', result);
      console.log('Result type:', result.constructor.name);
      console.log('Result status:', result.getStatusCode());
      console.log('Result body:', result.getBody());

      expect(result).toBeInstanceOf(SuccessMessage);
      expect(result.getStatusCode()).toBe(200);
      expect(result.getBody()).toContain('Wysłano magiczny pakiet WoL do testpc1');
      expect(result.getBody()).toContain('testuser');

      expect(wol.wake).toHaveBeenCalledWith('00:11:22:33:44:55', { address: '255.255.255.255' }, expect.any(Function));
    });

    it('should return success for valid computer by MAC', async () => {
      const wol = require('wake_on_lan');
      wol.wake.mockImplementation((mac: string, options: any, callback: (err: Error | null) => void) => {
        callback(null); // success
      });

      const result = await wakeComputer('?computer=00:11:22:33:44:55', 'testuser');

      expect(result).toBeInstanceOf(SuccessMessage);
      expect(result.getStatusCode()).toBe(200);
      expect(result.getBody()).toContain('Wysłano magiczny pakiet WoL do testpc1');
    });

    it('should return error when WoL fails', async () => {
      const wol = require('wake_on_lan');
      wol.wake.mockImplementation((mac: string, options: any, callback: (err: Error | null) => void) => {
        callback(new Error('Network error')); // failure
      });

      const result = await wakeComputer('?computer=testpc1', 'testuser');

      expect(result).toBeInstanceOf(Error);
      expect(result.getStatusCode()).toBe(500);
      expect(result.getBody()).toBe('Błąd wysłania Wake-on-LAN');
    });
  });
}); 