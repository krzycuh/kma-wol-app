export interface Computer {
  name: string;
  id: string;
  ip?: string;
  // Można dodać inne pola w przyszłości
  // location?: string;
  // description?: string;
  // type?: string;
}

export interface ComputerCardProps {
  computer: Computer;
  onWake: (computer: Computer) => void;
  onPing: (
    computer: Computer
  ) => Promise<{ status: 'online' | 'offline'; message: string } | null>;
  onShutdown: (computer: Computer) => Promise<boolean>;
  onGetLogs: (computer: Computer, limit?: number) => Promise<ComputerLog[]>;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ComputerLog {
  ts: string;
  user: string;
  action: 'wake' | 'ping' | 'shutdown';
  status: 'success' | 'error' | 'online' | 'offline';
  message?: string;
}
