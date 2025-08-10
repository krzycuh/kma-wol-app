import path from 'path';
import fs from 'fs';
import { promises as fsp } from 'fs';

type ComputerEvent = {
  ts: string; // ISO timestamp
  user: string; // user who performed the action
  action: 'wake' | 'ping' | 'shutdown';
  status: 'success' | 'error' | 'online' | 'offline';
  message?: string;
};

const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  if (!fs.existsSync(dirPath)) {
    await fsp.mkdir(dirPath, { recursive: true });
  }
};

const sanitizeComputerName = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9-_]+/g, '_');
};

const getLogDir = (): string => {
  const cwd = process.env.NODE_CWD || process.cwd();
  // Allow override via env
  const configured = process.env.LOG_DIR;
  return configured ? configured : path.join(cwd, 'logs');
};

const getLogFilePath = (computerName: string): string => {
  const dir = getLogDir();
  const fileName = `${sanitizeComputerName(computerName)}.log.jsonl`;
  return path.join(dir, fileName);
};

export const logComputerEvent = async (
  computerName: string,
  event: Omit<ComputerEvent, 'ts'>
): Promise<void> => {
  try {
    const dir = getLogDir();
    await ensureDirectoryExists(dir);
    const filePath = getLogFilePath(computerName);
    const line = JSON.stringify({ ...event, ts: new Date().toISOString() }) + '\n';
    await fsp.appendFile(filePath, line, { encoding: 'utf-8' });
  } catch {
    // Intentionally ignore logging errors to avoid breaking main flow
  }
};

export const getComputerLogs = async (
  computerName: string,
  limit: number = 10
): Promise<ComputerEvent[]> => {
  try {
    const filePath = getLogFilePath(computerName);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const content = await fsp.readFile(filePath, 'utf-8');
    const lines = content.trim().length ? content.trim().split('\n') : [];
    const events = lines
      .map(l => {
        try {
          return JSON.parse(l) as ComputerEvent;
        } catch {
          return null;
        }
      })
      .filter((e): e is ComputerEvent => e !== null);
    // return last N, newest first
    return events.slice(-limit).reverse();
  } catch {
    return [];
  }
};

export type { ComputerEvent };


