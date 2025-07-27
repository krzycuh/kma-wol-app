import { IncomingMessage, ServerResponse } from 'http';
import { serveFile } from '../middleware/staticFiles';
import path from 'path';

export function handlePageRoutes(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string
): boolean {
  // Strona główna
  if (req.method === 'GET' && pathname === '/') {
    const filePath = path.join(__dirname, '../../../frontend/public/index.html');
    if (!serveFile(res, filePath)) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Błąd serwera');
    }
    return true;
  }

  // Strona unauthorized
  if (req.method === 'GET' && pathname === '/unauthorized') {
    const filePath = path.join(__dirname, '../../../frontend/public/unauthorized.html');
    if (!serveFile(res, filePath, 401)) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Błąd serwera');
    }
    return true;
  }

  return false;
} 