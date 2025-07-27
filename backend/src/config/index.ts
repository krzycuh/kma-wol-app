// Parse tokens from environment variable
export type TokenMap = { [token: string]: string };
export const VALID_TOKENS: TokenMap = {};

(process.env.TOKENS || '')
  .split(',')
  .forEach(pair => {
    const [token, name] = pair.split('->');
    if (token && name) VALID_TOKENS[token] = name;
  });

export type Computer = { name: string; mac: string };
export const COMPUTERS: Computer[] = (process.env.COMPUTERS || '')
  .split(',')
  .map(pair => {
    const [name, mac] = pair.split('->');
    return { name, mac };
  })
  .filter(c => c.name && c.mac);

export const PORT = parseInt(process.env.PORT || '3000', 10);
export const PUBLIC_DIR = '../frontend/public'; 