import { Box, Typography, CircularProgress } from '@mui/material';

export function LoadingScreen() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Fixed background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 -z-10"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Box className="text-center">
          <CircularProgress className="text-purple-600 mb-4" />
          <Typography variant="h6" className="text-gray-600">
            Ładowanie aplikacji...
          </Typography>
        </Box>
      </div>
    </div>
  );
}
