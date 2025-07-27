// Global test setup
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Wyciszamy console.log w testach, aby nie widzieć debug output
global.console = {
  ...console,
  log: () => {},
  error: () => {},
  warn: () => {},
  info: () => {},
  debug: () => {},
};