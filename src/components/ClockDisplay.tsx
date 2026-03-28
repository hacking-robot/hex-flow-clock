import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ProgressIndicator } from './ProgressIndicator';
import type { BlockState } from '../lib/timeFormatter';

interface ClockDisplayProps {
  current: BlockState;
  progress: number;
  currentDate: Date;
  subBlockMinutes: number;
}

export function ClockDisplay({ current, progress, currentDate, subBlockMinutes }: ClockDisplayProps) {
  const h = currentDate.getHours();
  const m = currentDate.getMinutes().toString().padStart(2, '0');
  const currentTime = `${h}:${m}`;

  const subStart = current.blockStartMinute + (current.subBlock - 1) * subBlockMinutes;
  const subEnd = subStart + subBlockMinutes;
  const fmt = (min: number) => {
    const hh = Math.floor((min % 1440) / 60);
    const mm = (min % 1440) % 60;
    return `${hh}:${mm.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h1"
        component="div"
        sx={{ fontSize: { xs: '3rem', sm: '5rem' }, fontWeight: 700, lineHeight: 1.2 }}
      >
        {current.block}
        <Typography
          component="span"
          sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem' }, fontWeight: 500, color: 'text.secondary' }}
        >
          .{current.subBlock}
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: { xs: '0.9rem', sm: '1.2rem' }, fontWeight: 400, color: 'text.secondary', ml: 1 }}
        >
          +{current.minutesInSubBlock}'
        </Typography>
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
        Block {current.block} of {current.totalBlocks} · Sub {current.subBlock} of {current.subBlocksPerBlock}
      </Typography>

      <Box sx={{ mt: 2, width: '100%', maxWidth: 300 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">{fmt(subStart)}</Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>{currentTime}</Typography>
          <Typography variant="caption" color="text.secondary">{fmt(subEnd)}</Typography>
        </Box>
        <ProgressIndicator progress={progress} />
      </Box>

      <Box aria-live="polite" sx={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        Block {current.block} sub {current.subBlock}, {current.minutesInSubBlock} minutes in
      </Box>
    </Box>
  );
}
