export interface Computer {
  name: string;
  id: string;
  // Można dodać inne pola w przyszłości
  // location?: string;
  // description?: string;
  // type?: string;
}

export interface ComputerCardProps {
  computer: Computer;
  onWake: (computer: Computer) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
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
