import { IncomingMessage, ServerResponse } from 'http';
import { serveFile } from '../middleware/staticFiles';
import { PUBLIC_DIR } from '../config';
import path from 'path';

export function handlePageRoutes(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string
): boolean {


  // Strona unauthorized
  if (req.method === 'GET' && pathname === '/unauthorized') {
    const filePath = path.join(PUBLIC_DIR, '/unauthorized.html');
    if (!serveFile(res, filePath, 401)) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Błąd serwera');
    }
    return true;
  }

  // SPA fallback: tylko dla głównej strony
  if (req.method === 'GET' && pathname === '/') {
    const filePath = path.join(PUBLIC_DIR, '/index.html');
    if (serveFile(res, filePath)) {
      return true;
    } else {
      // Jeśli index.html nie istnieje, zwróć 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Nie znaleziono');
      return true;
    }
  }

  return false;
} 