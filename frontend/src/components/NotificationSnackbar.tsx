import { Snackbar, Alert } from '@mui/material';
import type { SnackbarState } from '../types';

interface NotificationSnackbarProps {
  snackbar: SnackbarState;
  onClose: () => void;
}

export function NotificationSnackbar({ snackbar, onClose }: NotificationSnackbarProps) {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity={snackbar.severity}
        className="w-full"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}
