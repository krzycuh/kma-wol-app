// Nie wyciszamy console.log w testach, aby widzieć debug output
global.console = {
  ...console,
  log: () => {},
  error: () => {},
  warn: () => {},
  info: () => {},
  debug: () => {},
};