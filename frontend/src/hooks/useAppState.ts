import { useState, useEffect } from 'react';
import type { Computer } from '../types';
import { useApi } from './useApi';

export const useAppState = () => {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    loading,
    error,
    snackbar,
    hideSnackbar,
    checkAuth,
    fetchComputers,
    wakeComputer,
    pingComputer,
    shutdownComputer
  } = useApi();

  useEffect(() => {
    // Pobierz token z URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    setToken(urlToken);

    if (!urlToken) {
      setIsInitialized(true);
      return;
    }

    // Sprawdź token i pobierz dane
    initializeApp(urlToken);
  }, []);

  const initializeApp = async (authToken: string) => {
    try {
      // Sprawdź autoryzację
      const userName = await checkAuth(authToken);
      if (userName) {
        setUser(userName);
        
        // Pobierz listę komputerów
        const computersList = await fetchComputers(authToken);
        setComputers(computersList);
      }
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setIsInitialized(true);
    }
  };

  const handleWakeComputer = async (computer: Computer) => {
    if (!token) {
      return;
    }

    await wakeComputer(computer, token);
  };

  const handlePingComputer = async (computer: Computer) => {
    if (!token) {
      return null;
    }

    return await pingComputer(computer, token);
  };

  const handleShutdownComputer = async (computer: Computer) => {
    if (!token) {
      return false;
    }
    return await shutdownComputer(computer, token);
  };

  return {
    computers,
    user,
    token,
    loading,
    error,
    snackbar,
    isInitialized,
    hideSnackbar,
    handleWakeComputer,
    handlePingComputer,
    handleShutdownComputer
  };
};
