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

export function ComputerCard({ computer, onWake, isExpanded, onToggleExpand }: ComputerCardProps) {
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
                label="Online" 
                color="success" 
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
            
            <Typography variant="body2" className="text-gray-500">
              Ostatnia aktywność: 2 minuty temu
            </Typography>
          </Box>
        </CardContent>
      </Collapse>

      <CardActions className="pt-0">
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
