import './App.css';
import { Box, Alert } from '@mui/material';
import { useAppState } from './hooks/useAppState';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthScreen } from './components/AuthScreen';
import { ComputerList } from './components/ComputerList';
import { NotificationSnackbar } from './components/NotificationSnackbar';

function App() {
  const {
    computers,
    user,
    token,
    loading,
    error,
    snackbar,
    isInitialized,
    hideSnackbar,
    handleWakeComputer
  } = useAppState();

  // Loading screen
  if (loading || !isInitialized) {
    return <LoadingScreen />;
  }

  // Auth screen
  if (!token) {
    return <AuthScreen />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Fixed background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 -z-10"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <Header user={user} />

        {/* Main Content */}
        <Box className="max-w-7xl mx-auto px-4 pb-12">
          {error ? (
            <Alert severity="error" className="mb-6">
              {error}
            </Alert>
          ) : (
            <ComputerList 
              computers={computers} 
              onWake={handleWakeComputer} 
            />
          )}
        </Box>

        {/* Notifications */}
        <NotificationSnackbar 
          snackbar={snackbar} 
          onClose={hideSnackbar} 
        />
      </div>
    </div>
  );
}

export default App;
