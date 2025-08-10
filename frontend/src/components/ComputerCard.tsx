import { 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Typography, 
  Box, 
  Chip
} from '@mui/material';
import { useState, useRef } from 'react';
import { 
  PowerSettingsNew, 
  Computer,
  NetworkCheck,
  Refresh
} from '@mui/icons-material';
import type { ComputerCardProps } from '../types';
import { ComputerLogs, type ComputerLogsRef } from './ComputerLogs';

export function ComputerCard({ computer, onWake, onPing, onShutdown, onGetLogs }: ComputerCardProps) {
  const [isPinging, setIsPinging] = useState(false);
  const [pingStatus, setPingStatus] = useState<'online' | 'offline' | null>(null);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const logsRef = useRef<ComputerLogsRef>(null);

  const handlePingClick = async () => {
    setIsPinging(true);
    try {
      const result = await onPing(computer);
      if (result) {
        setPingStatus(result.status);
      } else {
        setPingStatus(null);
      }
      // Odśwież logi po akcji
      await logsRef.current?.refreshLogs();
    } finally {
      setIsPinging(false);
    }
  };
  return (
    <Card 
      className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl"
      elevation={0}
    >
      <CardContent className="pb-2" sx={{ px: 2 }}>
        <Box className="flex items-center space-x-2">
          <Computer className="text-purple-600" />
          <Typography variant="h6" className="font-semibold text-gray-800">
            {computer.name}
          </Typography>
        </Box>
      </CardContent>

      <CardContent className="pt-0" sx={{ px: 2 }}>
        <Box className="space-y-3">
          <Box className="flex flex-wrap gap-2 items-center">
            <Chip 
              icon={<NetworkCheck />} 
              label={
                isPinging
                  ? 'Ping: Sprawdzanie…'
                  : pingStatus === 'online'
                    ? 'Ping: Online'
                    : pingStatus === 'offline'
                      ? 'Ping: Offline'
                      : 'Ping: Nie sprawdzono'
              }
              color={
                isPinging
                  ? 'info'
                  : pingStatus === 'online'
                    ? 'success'
                    : pingStatus === 'offline'
                      ? 'error'
                      : 'default'
              }
              size="small" 
              variant="outlined"
              onDelete={handlePingClick}
              deleteIcon={<Refresh fontSize="small" />}
            />
          </Box>
        </Box>
      </CardContent>

      <CardActions
        className="pt-0 flex flex-col gap-2 w-full"
        disableSpacing
        sx={{
          px: 2,
          pt: 0,
          width: '100%',
          alignItems: 'stretch'
        }}
      >
        <Button
          variant="outlined"
          onClick={async () => {
            setIsShuttingDown(true);
            try {
              await onShutdown(computer);
              // Odśwież logi po akcji
              await logsRef.current?.refreshLogs();
            } finally {
              setIsShuttingDown(false);
            }
          }}
          className="w-full border-red-600 text-red-600 hover:border-red-700 hover:text-red-700"
          size="large"
          disabled={isShuttingDown}
        >
          {isShuttingDown ? 'Wyłączanie…' : 'Wyłącz'}
        </Button>
        <Button
          variant="contained"
          startIcon={<PowerSettingsNew />}
          onClick={async () => {
            await onWake(computer);
            // Odśwież logi po akcji
            await logsRef.current?.refreshLogs();
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2"
          size="large"
        >
          Włącz
        </Button>
      </CardActions>

      {/* Komponent logów na dole karty */}
      <CardContent sx={{ px: 2, pt: 2 }}>
        <ComputerLogs 
          ref={logsRef}
          computer={computer} 
          onGetLogs={onGetLogs} 
        />
      </CardContent>
    </Card>
  );
}
