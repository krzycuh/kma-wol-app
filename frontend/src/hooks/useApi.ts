import { useState, useCallback } from 'react';
import type { Computer, SnackbarState, ComputerLog } from '../types';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const checkAuth = useCallback(async (token: string): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/user?token=${token}`);
      if (!response.ok) {
        throw new Error('Nieprawidłowy token autoryzacji');
      }
      
      const userData = await response.json();
      return userData.name || 'Unknown User';
    } catch (err) {
      const errorMessage = 'Błąd autoryzacji. Sprawdź token.';
      setError(errorMessage);
      console.error('Auth error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComputers = useCallback(async (token: string): Promise<Computer[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/computers?token=${token}`);
      if (!response.ok) {
        throw new Error('Failed to fetch computers');
      }
      
      const data = await response.json();
      return data || [];
    } catch (err) {
      const errorMessage = 'Nie udało się załadować listy komputerów';
      setError(errorMessage);
      console.error('Error fetching computers:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const wakeComputer = useCallback(async (computer: Computer, token: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/wake?computer=${computer.name}&token=${token}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        let message: string;
        
        if (contentType?.includes('application/json')) {
          const data = await response.json();
          message = data.message || `Wysłano Wake-on-LAN do ${computer.name}`;
        } else {
          message = await response.text();
        }
        
        showSnackbar(message, 'success');
        return true;
      } else {
        const contentType = response.headers.get('content-type');
        let errorMessage: string;
        
        if (contentType?.includes('application/json')) {
          const data = await response.json();
          errorMessage = data.error || 'Błąd podczas wysyłania Wake-on-LAN';
        } else {
          errorMessage = await response.text();
        }
        
        showSnackbar(errorMessage, 'error');
        return false;
      }
    } catch (err) {
      showSnackbar('Błąd połączenia z serwerem', 'error');
      return false;
    }
  }, [showSnackbar]);

  const pingComputer = useCallback(async (computer: Computer, token: string): Promise<{ status: 'online' | 'offline'; message: string } | null> => {
    try {
      const response = await fetch(`/api/ping?computer=${computer.name}&token=${token}`);
      const data = await response.json();
      
      if (response.ok) {
        return {
          status: data.status,
          message: data.message
        };
      } else {
        showSnackbar(
          data.error || 'Błąd podczas sprawdzania dostępności',
          'error'
        );
        return null;
      }
    } catch (err) {
      showSnackbar('Błąd połączenia z serwerem', 'error');
      return null;
    }
  }, [showSnackbar]);

  const shutdownComputer = useCallback(async (computer: Computer, token: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/shutdown?computer=${computer.name}&token=${token}`);
      const data = await response.json();
      if (response.ok) {
        showSnackbar(
          data.message || `Wysłano polecenie wyłączenia do ${computer.name}`,
          'success'
        );
        return true;
      } else {
        showSnackbar(
          data.error || `Błąd podczas wyłączania ${computer.name}`,
          'error'
        );
        return false;
      }
    } catch (_err) {
      showSnackbar('Błąd połączenia z serwerem', 'error');
      return false;
    }
  }, [showSnackbar]);

  const getComputerLogs = useCallback(async (computer: Computer, token: string, limit: number = 5): Promise<ComputerLog[]> => {
    try {
      const response = await fetch(`/api/logs?computer=${computer.name}&limit=${limit}&token=${token}`);
      const data = await response.json();
      
      if (response.ok) {
        return data || [];
      } else {
        console.error('Error fetching logs:', data.error);
        return [];
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      return [];
    }
  }, []);

  return {
    loading,
    error,
    snackbar,
    showSnackbar,
    hideSnackbar,
    checkAuth,
    fetchComputers,
    wakeComputer,
    pingComputer,
    shutdownComputer,
    getComputerLogs
  };
};
