import { Typography, Box, Chip } from '@mui/material';
import { Security } from '@mui/icons-material';

interface HeaderProps {
  user: string | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <Box className="text-center py-12 px-4">
      <Typography 
        variant="h2" 
        className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4"
        sx={{ textAlign: 'center' }}
      >
        Wake-on-LAN Manager
      </Typography>
      <Typography 
        variant="h5" 
        className="text-gray-600 mb-2"
        sx={{ textAlign: 'center' }}
      >
        Zarządzaj swoimi komputerami
      </Typography>
      <Typography 
        variant="body1" 
        className="text-gray-500 mb-4"
        sx={{ textAlign: 'center' }}
      >
        Wybierz komputer z listy poniżej i wyślij magiczny pakiet Wake-on-LAN, aby go włączyć zdalnie.
      </Typography>
      {user && (
        <Chip 
          icon={<Security />} 
          label={`Zalogowany jako: ${user}`} 
          color="primary" 
          variant="outlined"
          className="mt-2"
        />
      )}
    </Box>
  );
}
