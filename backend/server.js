require('dotenv').config();
const http = require('http');
const wol = require('wake_on_lan');
const fs = require('fs');
const path = require('path');

// Parse tokens from environment variable
const VALID_TOKENS = {};
(process.env.TOKENS || '')
.split(',')
.forEach(pair => {
  const [token, name] = pair.split('->');
  if (token && name) VALID_TOKENS[token] = name;
});

// Parse computers from environment variable
const COMPUTERS = (process.env.COMPUTERS || '')
.split(',')
.map(pair => {
  const [name, mac] = pair.split('->');
  return { name, mac };
}).filter(c => c.name && c.mac);

const PORT = 3000;

// Function to validate token and get user info
function validateToken(token) {
  if (!token || !VALID_TOKENS[token]) {
    return null;
  }
  return VALID_TOKENS[token];
}

// Function to parse URL and query parameters
function parseUrl(url) {
  const urlObj = new URL(url, `http://localhost:${PORT}`);
  return {
    pathname: urlObj.pathname,
    token: urlObj.searchParams.get('token')
  };
}

const server = http.createServer((req, res) => {
  const { pathname, token } = parseUrl(req.url);
  
  // Check authentication for all routes except error pages
  const user = validateToken(token);
  if (!user && pathname !== '/unauthorized') {
    res.writeHead(302, { 'Location': '/unauthorized' });
    res.end();
    return;
  }

  console.log(`jestem klikany przez użytkownika: ${user}, ${pathname}, ${token}`);
        

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
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const computerId = urlObj.searchParams.get('computer');
    const computer = COMPUTERS.find(c => c.name === computerId || c.mac === computerId);
    if (!computer) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Nieprawidłowy komputer');
      return;
    }
    wol.wake(computer.mac, (err) => {
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
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Nie znaleziono');
  }
});

server.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
