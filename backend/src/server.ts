import http, { IncomingMessage, ServerResponse } from 'http';
import { PORT } from './config';
import { parseUrl } from './utils/urlParser';
import { validateToken } from './middleware/auth';
import { handlePageRoutes, handleNotFound } from './routes/pageRoutes';
import { handleApiRoutes } from './routes/apiRoutes';
import { handleStaticRoutes } from './routes/staticRoutes';
import { PUBLIC_DIR } from './config';

function createServer(): http.Server {
  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const { pathname, token } = parseUrl(req.url || '/');

    // 1. Handle static files FIRST (JS, CSS, images, etc.) - no auth required
    if (handleStaticRoutes(req, res, pathname)) {
      return;
    }

    // 2. Check authentication for all other routes except error pages
    const user = validateToken(token);

    if (!user && pathname !== '/unauthorized') {
      console.log(new Date().toISOString(), 'Redirecting to unauthorized', pathname);
      res.writeHead(302, { Location: '/unauthorized' });
      res.end();
      return;
    }

    // 3. Handle API routes (JSON endpoints)
    if (await handleApiRoutes(req, res, pathname, user || '')) {
      return;
    }

    // 4. Handle page routes (HTML pages + SPA fallback)
    if (handlePageRoutes(req, res, pathname)) {
      return;
    }

    // 5. If we get here, it's a 404 - Not Found
    handleNotFound(res);
  });

  return server;
}

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(new Date().toISOString(), `Serwer działa na porcie ${PORT}`);
    console.log(new Date().toISOString(), `PUBLIC_DIR: ${PUBLIC_DIR}`);
  });
}

export default createServer; 