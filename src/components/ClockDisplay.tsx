import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ProgressIndicator } from './ProgressIndicator';

interface ClockDisplayProps {
  blockLabel: string;
  blockNumber: number;
  hour: number;
  progress: number;
}

export function ClockDisplay({ blockLabel, blockNumber, hour, progress }: ClockDisplayProps) {
  const globalBlock = hour * 4 + blockNumber;

  return (
    <Box>
      <Typography
        variant="h1"
        component="div"
        sx={{ fontSize: { xs: '3rem', sm: '5rem' }, fontWeight: 700, lineHeight: 1.2 }}
      >
        {globalBlock}
        <Typography
          component="span"
          sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' }, fontWeight: 400, color: 'text.secondary', ml: 1 }}
        >
          / 96
        </Typography>
      </Typography>
      <Typography
        variant="body2"
        component="div"
        sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, mt: 2, color: 'text.secondary' }}
      >
        {blockLabel}
      </Typography>
      <Box sx={{ mt: { xs: 1, sm: 2 } }}>
        <ProgressIndicator progress={progress} />
      </Box>
      <Box aria-live="polite" sx={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        Block {globalBlock} of 96, {blockLabel}
      </Box>
    </Box>
  );
}
