import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ProgressIndicator } from './ProgressIndicator';
import { formatUTC } from '../lib/timeFormatter';
import type { HexTime } from '../lib/timeFormatter';

interface Props {
  current: HexTime;
  currentDate: Date;
}

export function ClockDisplay({ current, currentDate }: Props) {
  const utcSec = currentDate.getUTCHours() * 3600 + currentDate.getUTCMinutes() * 60 + currentDate.getUTCSeconds();

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h1"
        component="div"
        sx={{ fontSize: { xs: '4rem', sm: '6rem' }, fontWeight: 700, lineHeight: 1, fontFamily: 'monospace', letterSpacing: '0.05em' }}
      >
        {current.hex}
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        UTC {formatUTC(utcSec)}
      </Typography>

      <Box sx={{ mt: 2, width: '100%', maxWidth: 300 }}>
        <ProgressIndicator progress={current.tickProgress} />
      </Box>

      <Box aria-live="polite" sx={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        Hex time {current.hex}, UTC {formatUTC(utcSec)}
      </Box>
    </Box>
  );
}
