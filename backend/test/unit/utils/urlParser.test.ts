import { parseUrl, getQueryParam } from '../../../src/utils/urlParser';

// Mock PORT for testing
jest.mock('../../../src/config', () => ({
  PORT: 3000
}));

describe('UrlParser', () => {
  describe('parseUrl', () => {
    it('should parse URL with token', () => {
      const result = parseUrl('/computers?token=test-token');
      
      expect(result.pathname).toBe('/computers');
      expect(result.token).toBe('test-token');
    });

    it('should parse URL without token', () => {
      const result = parseUrl('/computers');
      
      expect(result.pathname).toBe('/computers');
      expect(result.token).toBeNull();
    });

    it('should parse URL with multiple query parameters', () => {
      const result = parseUrl('/wake?computer=testpc&token=test-token&other=value');
      
      expect(result.pathname).toBe('/wake');
      expect(result.token).toBe('test-token');
    });

    it('should handle empty URL', () => {
      const result = parseUrl('');
      
      expect(result.pathname).toBe('/');
      expect(result.token).toBeNull();
    });

    it('should handle root URL', () => {
      const result = parseUrl('/');
      
      expect(result.pathname).toBe('/');
      expect(result.token).toBeNull();
    });
  });

  describe('getQueryParam', () => {
    it('should extract existing query parameter', () => {
      const param = getQueryParam('/wake?computer=testpc', 'computer');
      expect(param).toBe('testpc');
    });

    it('should return null for non-existent parameter', () => {
      const param = getQueryParam('/wake?computer=testpc', 'nonexistent');
      expect(param).toBeNull();
    });

    it('should return null for URL without query parameters', () => {
      const param = getQueryParam('/computers', 'computer');
      expect(param).toBeNull();
    });

    it('should handle empty parameter value', () => {
      const param = getQueryParam('/wake?computer=', 'computer');
      expect(param).toBe('');
    });

    it('should handle multiple parameters with same name', () => {
      const param = getQueryParam('/wake?computer=pc1&computer=pc2', 'computer');
      expect(param).toBe('pc1'); // URLSearchParams.get() returns first occurrence
    });
  });
}); 