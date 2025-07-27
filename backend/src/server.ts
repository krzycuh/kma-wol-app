import http, { IncomingMessage, ServerResponse } from 'http';
import { PORT } from './config';
import { parseUrl } from './utils/urlParser';
import { validateToken } from './middleware/auth';
import { handlePageRoutes } from './routes/pageRoutes';
import { handleApiRoutes } from './routes/apiRoutes';
import { handleStaticRoutes } from './routes/staticRoutes';

function createServer(): http.Server {
  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
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

    // 1. Handle page routes (HTML pages)
    if (handlePageRoutes(req, res, pathname)) {
      return;
    }

    // 2. Handle API routes (JSON endpoints)
    if (await handleApiRoutes(req, res, pathname, user || '')) {
      return;
    }

    // 3. Handle static files (JS, CSS, images, etc.)
    if (handleStaticRoutes(req, res, pathname)) {
      return;
    }

    // 404 - Not Found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Nie znaleziono');
  });

  return server;
}

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
  });
}

export default createServer; 