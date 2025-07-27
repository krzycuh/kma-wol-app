import { IncomingMessage, ServerResponse } from 'http';
import { getComputers, wakeComputer } from '../controllers/computerController';
import { getUserInfo } from '../controllers/userController';

async function sendResponse(res: ServerResponse, result: any): Promise<void> {
  if (result instanceof Promise) {
    const resolvedResult = await result;
    res.writeHead(resolvedResult.getStatusCode(), { 'Content-Type': resolvedResult.getContentType() });
    res.end(resolvedResult.getBody());
  } else {
    res.writeHead(result.getStatusCode(), { 'Content-Type': result.getContentType() });
    res.end(result.getBody());
  }
}

export async function handleApiRoutes(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
  user: string
): Promise<boolean> {
  // Lista komputerów
  if (req.method === 'GET' && pathname === '/computers') {
    const result = getComputers();
    await sendResponse(res, result);
    return true;
  }

  // Informacje o użytkowniku
  if (req.method === 'GET' && pathname === '/user') {
    const result = getUserInfo(user);
    await sendResponse(res, result);
    return true;
  }

  // Wake-on-LAN
  if (req.method === 'GET' && pathname === '/wake') {
    const result = wakeComputer(req.url || '/', user);
    await sendResponse(res, result);
    return true;
  }

  return false;
} 