import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Computer } from '@mui/icons-material';
import type { Computer as ComputerType } from '../types';
import { ComputerCard } from './ComputerCard';

interface ComputerListProps {
  computers: ComputerType[];
  onWake: (computer: ComputerType) => void;
}

export function ComputerList({ computers, onWake }: ComputerListProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = (computerName: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(computerName)) {
      newExpanded.delete(computerName);
    } else {
      newExpanded.add(computerName);
    }
    setExpandedCards(newExpanded);
  };

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
          isExpanded={expandedCards.has(computer.name)}
          onToggleExpand={() => toggleCardExpansion(computer.name)}
        />
      ))}
    </Box>
  );
}
