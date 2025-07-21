import http, { IncomingMessage, ServerResponse } from 'http';
import wol from 'wake_on_lan';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Parse tokens from environment variable
type TokenMap = { [token: string]: string };
const VALID_TOKENS: TokenMap = {};
console.log('process.env', process.env);
(process.env.TOKENS || '')
  .split(',')
  .forEach(pair => {
    console.log('pair', pair);
    const [token, name] = pair.split('->');
    if (token && name) VALID_TOKENS[token] = name;
    console.log(`registered token1: "${pair}", ${token}, name: ${name}`);
  });

type Computer = { name: string; mac: string };
const COMPUTERS: Computer[] = (process.env.COMPUTERS || '')
  .split(',')
  .map(pair => {
    const [name, mac] = pair.split('->');
    return { name, mac };
  })
  .filter(c => c.name && c.mac);

const PORT = 3000;

// Function to validate token and get user info
function validateToken(token: string | null): string | null {
  if (!token || !VALID_TOKENS[token]) {
    return null;
  }
  return VALID_TOKENS[token];
}

// Function to parse URL and query parameters
function parseUrl(url: string): { pathname: string; token: string | null } {
  const urlObj = new URL(url, `http://localhost:${PORT}`);
  return {
    pathname: urlObj.pathname,
    token: urlObj.searchParams.get('token'),
  };
}

const PUBLIC_DIR = path.join(__dirname, '../frontend/public');

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const { pathname, token } = parseUrl(req.url || '/');

  console.log('pathname', pathname);
  console.log('token', token);
  // Check authentication for all routes except error pages
  const user = validateToken(token);
  console.log('user', user);
  if (!user && pathname !== '/unauthorized') {
    res.writeHead(302, { Location: '/unauthorized' });
    res.end();
    return;
  }

  if (req.method === 'GET' && pathname === '/') {
    fs.readFile(path.join(__dirname, '../frontend/public/index.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Błąd serwera');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data.toString());
    });
  } else if (req.method === 'GET' && pathname === '/computers') {
    const computerNames = COMPUTERS.map(c => c.name);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(computerNames));
  } else if (req.method === 'GET' && pathname === '/user') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ name: user }));
  } else if (req.method === 'GET' && pathname === '/wake') {
    // Accept computer name or MAC as a query parameter
    const urlObj = new URL(req.url || '/', `http://localhost:${PORT}`);
    const computerId = urlObj.searchParams.get('computer');
    const computer = COMPUTERS.find(c => c.name === computerId || c.mac === computerId);
    if (!computer) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Nieprawidłowy komputer');
      return;
    }
    wol.wake(computer.mac, { address: '255.255.255.255' }, (err: Error | null) => {
      if (err) {
        console.error(new Date().toISOString(), 'Błąd WoL:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Błąd wysłania Wake-on-LAN');
      } else {
        console.log(new Date().toISOString(), `Wysłano WoL do ${computer.mac} (${computer.name}) przez użytkownika: ${user}`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Wysłano magiczny pakiet WoL do ${computer.name} przez użytkownika: ${user}`);
      }
    });
  } else if (req.method === 'GET' && pathname === '/unauthorized') {
    fs.readFile(path.join(__dirname, '../frontend/public/unauthorized.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Błąd serwera');
        return;
      }
      res.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data.toString());
    });
  } else {
    // Obsługa plików statycznych (np. /main.js, /style.css, /favicon.ico)
    if (
      req.method === 'GET' &&
      pathname !== '/' &&
      pathname !== '/unauthorized' &&
      !pathname.startsWith('/api') &&
      !pathname.startsWith('/computers') &&
      !pathname.startsWith('/user') &&
      !pathname.startsWith('/wake')
    ) {
      const staticFilePath = path.join(PUBLIC_DIR, pathname);
      if (fs.existsSync(staticFilePath) && fs.statSync(staticFilePath).isFile()) {
        // Ustal content-type na podstawie rozszerzenia
        const ext = path.extname(staticFilePath).toLowerCase();
        const contentTypes: { [key: string]: string } = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
        };
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
        fs.createReadStream(staticFilePath).pipe(res);
        return;
      }
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Nie znaleziono');
  }
});

server.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
}); 