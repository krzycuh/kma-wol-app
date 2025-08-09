import { 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Typography, 
  Box, 
  Chip,
  IconButton,
  Collapse
} from '@mui/material';
import { useState } from 'react';
import { 
  PowerSettingsNew, 
  ExpandMore, 
  ExpandLess,
  Computer,
  NetworkCheck,
  Storage,
  Memory
} from '@mui/icons-material';
import type { ComputerCardProps } from '../types';

export function ComputerCard({ computer, onWake, onPing, isExpanded, onToggleExpand }: ComputerCardProps) {
  const [isPinging, setIsPinging] = useState(false);
  const [pingStatus, setPingStatus] = useState<'online' | 'offline' | null>(null);
  const [pingMessage, setPingMessage] = useState<string>('');

  const handlePingClick = async () => {
    setIsPinging(true);
    try {
      const result = await onPing(computer);
      if (result) {
        setPingStatus(result.status);
        setPingMessage(result.message);
      } else {
        setPingStatus(null);
        setPingMessage('');
      }
    } finally {
      setIsPinging(false);
    }
  };
  return (
    <Card 
      className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl"
      elevation={0}
    >
      <CardContent className="pb-2">
        <Box className="flex items-center justify-between">
          <Box className="flex items-center space-x-2">
            <Computer className="text-purple-600" />
            <Typography variant="h6" className="font-semibold text-gray-800">
              {computer.name}
            </Typography>
          </Box>
          <IconButton 
            onClick={onToggleExpand}
            size="small"
            className="text-gray-500 hover:text-purple-600"
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        
        <Typography variant="body2" className="text-gray-600 mt-1">
          ID: {computer.id}
        </Typography>
      </CardContent>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent className="pt-0">
          <Box className="space-y-3">
            {/* Status indicators - placeholders for future features */}
            <Box className="flex flex-wrap gap-2">
              <Chip 
                icon={<NetworkCheck />} 
                label={
                  isPinging
                    ? 'Sprawdzanie…'
                    : pingStatus === 'online'
                      ? 'Online'
                      : pingStatus === 'offline'
                        ? 'Offline'
                        : 'Nie sprawdzono'
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
              />
              <Chip 
                icon={<Storage />} 
                label="Storage OK" 
                color="info" 
                size="small" 
                variant="outlined"
              />
              <Chip 
                icon={<Memory />} 
                label="RAM: 8GB" 
                color="default" 
                size="small" 
                variant="outlined"
              />
            </Box>
            
            {pingMessage && (
              <Typography variant="body2" className="text-gray-500">
                {pingMessage}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Collapse>

      <CardActions className="pt-0">
        <Button
          variant="outlined"
          startIcon={<NetworkCheck />}
          onClick={handlePingClick}
          className="w-full border-purple-600 text-purple-600 hover:border-purple-700 hover:text-purple-700"
          size="large"
          disabled={isPinging}
        >
          {isPinging ? 'Sprawdzanie…' : 'Sprawdź ping'}
        </Button>
        <Button
          variant="contained"
          startIcon={<PowerSettingsNew />}
          onClick={() => onWake(computer)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2"
          size="large"
        >
          Wake Computer
        </Button>
      </CardActions>
    </Card>
  );
}
