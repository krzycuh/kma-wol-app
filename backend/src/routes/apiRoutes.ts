import { IncomingMessage, ServerResponse } from 'http';
import { getComputers, wakeComputer, pingComputer, shutdownComputer } from '../controllers/computerController';
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
  if (req.method === 'GET' && pathname === '/api/computers') {
    const result = getComputers();
    console.log(new Date().toISOString(), '[', user, ']', '/api/computers', result);
    await sendResponse(res, result);
    return true;
  }

  // Informacje o użytkowniku
  if (req.method === 'GET' && pathname === '/api/user') {
    const result = getUserInfo(user);
    console.log(new Date().toISOString(), '[', user, ']', '/api/user', result);
    await sendResponse(res, result);
    return true;
  }

  // Wake-on-LAN
  if (req.method === 'GET' && pathname === '/api/wake') {
    const result = wakeComputer(req.url || '/', user);
    console.log(new Date().toISOString(), '[', user, ']', '/api/wake', result);
    await sendResponse(res, result);
    return true; 
  }

  // Ping komputera
  if (req.method === 'GET' && pathname === '/api/ping') {
    const result = pingComputer(req.url || '/', user);
    console.log(new Date().toISOString(), '[', user, ']', '/api/ping', result);
    await sendResponse(res, result);
    return true;
  }

  // Wyłączenie komputera Windows
  if (req.method === 'GET' && pathname === '/api/shutdown') {
    const result = shutdownComputer(req.url || '/', user);
    console.log(new Date().toISOString(), '[', user, ']', '/api/shutdown', result);
    await sendResponse(res, result);
    return true;
  }

  return false;
} 