import { Box, Typography, Alert } from '@mui/material';
import { Security } from '@mui/icons-material';

export function AuthScreen() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Fixed background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 -z-10"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Box className="text-center max-w-md mx-auto p-6">
          <Security className="text-red-500 text-6xl mb-4" />
          <Typography variant="h5" className="text-gray-800 mb-4">
            Wymagana autoryzacja
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-6">
            Aby uzyskać dostęp do aplikacji, dodaj token autoryzacji do adresu URL:
          </Typography>
          <Alert severity="info" className="mb-4">
            <Typography variant="body2">
              Przykład: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000?token=YOUR_TOKEN</code>
            </Typography>
          </Alert>
        </Box>
      </div>
    </div>
  );
}
