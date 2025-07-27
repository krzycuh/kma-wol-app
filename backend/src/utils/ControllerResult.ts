// Base interface for controller results
export interface ControllerResult {
  getStatusCode(): number;
  getContentType(): string;
  getBody(): string;
}

// Success result with JSON object
export class SuccessObject implements ControllerResult {
  constructor(private jsonObject: any) {}

  getStatusCode(): number {
    return 200;
  }

  getContentType(): string {
    return 'application/json';
  }

  getBody(): string {
    return JSON.stringify(this.jsonObject);
  }
}

// Success result with simple message
export class SuccessMessage implements ControllerResult {
  constructor(private message: string) {}

  getStatusCode(): number {
    return 200;
  }

  getContentType(): string {
    return 'text/plain';
  }

  getBody(): string {
    return this.message;
  }
}

// Error result
export class Error implements ControllerResult {
  constructor(private message: string, private statusCode: number = 500) {}

  getStatusCode(): number {
    return this.statusCode;
  }

  getContentType(): string {
    return 'text/plain';
  }

  getBody(): string {
    return this.message;
  }
} 