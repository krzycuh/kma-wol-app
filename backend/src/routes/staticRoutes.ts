import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import { PUBLIC_DIR } from '../config';
import { serveFile } from '../middleware/staticFiles';

export function handleStaticRoutes(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string
): boolean {
  // Handle static files - check if pathname has a file extension
  if (req.method === 'GET' && path.extname(pathname)) {
    const staticFilePath = path.join(PUBLIC_DIR, pathname);
    if (serveFile(res, staticFilePath)) {
      return true;
    }
  }

  return false;
} 