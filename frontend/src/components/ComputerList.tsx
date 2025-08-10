import { Box, Typography } from '@mui/material';
import { Computer } from '@mui/icons-material';
import type { Computer as ComputerType } from '../types';
import { ComputerCard } from './ComputerCard';

interface ComputerListProps {
  computers: ComputerType[];
  onWake: (computer: ComputerType) => void;
  onPing: (
    computer: ComputerType
  ) => Promise<{ status: 'online' | 'offline'; message: string } | null>;
  onShutdown: (computer: ComputerType) => Promise<boolean>;
}

export function ComputerList({ computers, onWake, onPing, onShutdown }: ComputerListProps) {

  if (computers.length === 0) {
    return (
      <Box className="text-center py-12">
        <Computer className="text-gray-400 text-6xl mb-4" />
        <Typography variant="h6" className="text-gray-500 mb-2">
          Brak dostępnych komputerów
        </Typography>
        <Typography variant="body2" className="text-gray-400">
          Skonfiguruj komputery w ustawieniach aplikacji
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {computers.map((computer) => (
        <ComputerCard
          key={computer.name}
          computer={computer}
          onWake={onWake}
          onPing={onPing}
          onShutdown={onShutdown}
        />
      ))}
    </Box>
  );
}
