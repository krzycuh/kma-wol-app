import { 
  Box, 
  Typography, 
  Button, 
  Collapse, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider 
} from '@mui/material';
import { useState, useImperativeHandle, forwardRef } from 'react';
import { 
  PowerSettingsNew, 
  NetworkCheck, 
  History, 
  ExpandMore, 
  ExpandLess 
} from '@mui/icons-material';
import type { Computer, ComputerLog } from '../types';

interface ComputerLogsProps {
  computer: Computer;
  onGetLogs: (computer: Computer, limit?: number) => Promise<ComputerLog[]>;
}

export interface ComputerLogsRef {
  refreshLogs: () => Promise<void>;
}

export const ComputerLogs = forwardRef<ComputerLogsRef, ComputerLogsProps>(
  ({ computer, onGetLogs }, ref) => {
    const [logs, setLogs] = useState<ComputerLog[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
      if (!isExpanded && logs.length === 0) {
        setIsLoading(true);
        try {
          const fetchedLogs = await onGetLogs(computer, 10);
          setLogs(fetchedLogs);
        } finally {
          setIsLoading(false);
        }
      }
      setIsExpanded(!isExpanded);
    };

    const refreshLogs = async () => {
      const freshLogs = await onGetLogs(computer, 10);
      setLogs(freshLogs);
    };

    useImperativeHandle(ref, () => ({
      refreshLogs
    }));

    const formatTimestamp = (ts: string): string => {
      const date = new Date(ts);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'teraz';
      if (diffMins < 60) return `${diffMins} min temu`;
      if (diffHours < 24) return `${diffHours} h temu`;
      if (diffDays < 7) return `${diffDays} dni temu`;
      return date.toLocaleDateString('pl-PL');
    };

    const getActionIcon = (action: string) => {
      switch (action) {
        case 'wake': return <PowerSettingsNew fontSize="small" />;
        case 'ping': return <NetworkCheck fontSize="small" />;
        case 'shutdown': return <PowerSettingsNew fontSize="small" />;
        default: return <History fontSize="small" />;
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'success':
        case 'online': return 'success';
        case 'error':
        case 'offline': return 'error';
        default: return 'default';
      }
    };

    return (
      <Box className="space-y-3">
        {/* Ostatnia aktywność */}
        <Box className="flex items-center justify-between">
          <Typography variant="body2" className="text-gray-600 font-medium">
            Ostatnia aktywność
          </Typography>
          <Button
            size="small"
            onClick={handleToggle}
            disabled={isLoading}
            className="text-purple-600 hover:text-purple-700"
            endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
          >
            {isLoading ? 'Ładowanie...' : isExpanded ? 'Ukryj' : 'Pokaż'}
          </Button>
        </Box>

        <Collapse in={isExpanded}>
          {logs.length > 0 ? (
            <List dense className="bg-gray-50 rounded-lg">
              {logs.map((log, index) => (
                <Box key={index}>
                  <ListItem className="py-1">
                    <ListItemIcon className="min-w-0 mr-2">
                      <Box className={`text-${getStatusColor(log.status)}-600`}>
                        {getActionIcon(log.action)}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" className="font-medium">
                          {log.action === 'wake' ? 'Wake' : 
                           log.action === 'ping' ? 'Ping' : 
                           log.action === 'shutdown' ? 'Shutdown' : log.action}
                          {' '}
                          <span className={`text-${getStatusColor(log.status)}-600`}>
                            {log.status === 'success' ? '✓' : 
                             log.status === 'error' ? '✗' : 
                             log.status === 'online' ? 'Online' : 
                             log.status === 'offline' ? 'Offline' : log.status}
                          </span>
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" className="text-gray-500">
                          {formatTimestamp(log.ts)} przez {log.user}
                          {log.message && ` - ${log.message}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < logs.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body2" className="text-gray-500 text-center py-2">
              Brak aktywności
            </Typography>
          )}
        </Collapse>
      </Box>
    );
  }
);
