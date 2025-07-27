import { ControllerResult, SuccessObject, SuccessMessage, Error } from '../../../src/utils/ControllerResult';

describe('ControllerResult', () => {
  describe('SuccessObject', () => {
    it('should return JSON object with 200 status', () => {
      const data = { name: 'test', id: 123 };
      const result = new SuccessObject(data);

      expect(result.getStatusCode()).toBe(200);
      expect(result.getContentType()).toBe('application/json');
      expect(result.getBody()).toBe('{"name":"test","id":123}');
    });

    it('should handle empty object', () => {
      const result = new SuccessObject({});
      expect(result.getBody()).toBe('{}');
    });

    it('should handle null values', () => {
      const result = new SuccessObject({ name: null, value: undefined });
      expect(result.getBody()).toBe('{"name":null}'); // undefined is omitted by JSON.stringify
    });
  });

  describe('SuccessMessage', () => {
    it('should return plain text message with 200 status', () => {
      const message = 'Operation completed successfully';
      const result = new SuccessMessage(message);

      expect(result.getStatusCode()).toBe(200);
      expect(result.getContentType()).toBe('text/plain');
      expect(result.getBody()).toBe(message);
    });

    it('should handle empty message', () => {
      const result = new SuccessMessage('');
      expect(result.getBody()).toBe('');
    });
  });

  describe('Error', () => {
    it('should return error message with default 500 status', () => {
      const message = 'Internal server error';
      const result = new Error(message);

      expect(result.getStatusCode()).toBe(500);
      expect(result.getContentType()).toBe('text/plain');
      expect(result.getBody()).toBe(message);
    });

    it('should return error message with custom status code', () => {
      const message = 'Not found';
      const result = new Error(message, 404);

      expect(result.getStatusCode()).toBe(404);
      expect(result.getContentType()).toBe('text/plain');
      expect(result.getBody()).toBe(message);
    });

    it('should handle empty error message', () => {
      const result = new Error('', 400);
      expect(result.getBody()).toBe('');
      expect(result.getStatusCode()).toBe(400);
    });
  });
}); 