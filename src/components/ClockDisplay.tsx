import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ProgressIndicator } from './ProgressIndicator';

interface ClockDisplayProps {
  globalBlock: number;
  totalBlocks: number;
  blockLabel: string;
  progress: number;
  minutesElapsed: number;
  blockMinutes: number;
  currentDate: Date;
}

export function ClockDisplay({
  globalBlock, totalBlocks, blockLabel, progress, minutesElapsed, blockMinutes, currentDate,
}: ClockDisplayProps) {
  const blockProgress = (minutesElapsed / blockMinutes) * 100;
  const h = currentDate.getHours();
  const m = currentDate.getMinutes().toString().padStart(2, '0');
  const currentTime = `${h}:${m}`;

  const startParts = blockLabel.split(':');
  const startTotal = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
  const endTotal = (startTotal + blockMinutes) % 1440;
  const endH = Math.floor(endTotal / 60);
  const endM = (endTotal % 60).toString().padStart(2, '0');
  const blockEnd = `${endH}:${endM}`;

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h1"
        component="div"
        sx={{ fontSize: { xs: '3rem', sm: '5rem' }, fontWeight: 700, lineHeight: 1.2 }}
      >
        {globalBlock}
        <Typography
          component="span"
          sx={{ fontSize: { xs: '1rem', sm: '1.3rem' }, fontWeight: 400, color: 'text.secondary', ml: 1 }}
        >
          +{minutesElapsed}'
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' }, fontWeight: 400, color: 'text.secondary', ml: 1 }}
        >
          / {totalBlocks}
        </Typography>
      </Typography>

      <Box sx={{ mt: 2, width: '100%', maxWidth: 300 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">{blockLabel}</Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>{currentTime}</Typography>
          <Typography variant="caption" color="text.secondary">{blockEnd}</Typography>
        </Box>
        <ProgressIndicator progress={blockProgress} />
      </Box>

      <Box aria-live="polite" sx={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        Block {globalBlock} of {totalBlocks}, {minutesElapsed} minutes in, {blockLabel}
      </Box>
    </Box>
  );
}
