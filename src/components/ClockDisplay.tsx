import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ProgressIndicator } from './ProgressIndicator';
import { formatTime } from '../lib/timeFormatter';
import type { HexTime } from '../lib/timeFormatter';

interface Props {
  current: HexTime;
  currentDate: Date;
  showUTC?: boolean;
}

export function ClockDisplay({ current, currentDate, showUTC }: Props) {
  const localSec = currentDate.getHours() * 3600 + currentDate.getMinutes() * 60 + currentDate.getSeconds();

  return (
    <Box sx={{ textAlign: 'center', position: 'relative' }}>
      <Typography
        variant="h1"
        component="div"
        sx={{
          fontSize: { xs: '5rem', sm: '8rem' },
          fontWeight: 700,
          lineHeight: 1,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          letterSpacing: '0.08em',
          background: 'linear-gradient(135deg, #E0E0FF 0%, #7C4DFF 40%, #00E5FF 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 30px rgba(124, 77, 255, 0.4)) drop-shadow(0 0 60px rgba(0, 229, 255, 0.2))',
        }}
      >
        {current.hex}
      </Typography>

      <Box sx={{ mt: 3, width: '100%', maxWidth: 320, mx: 'auto' }}>
        <ProgressIndicator progress={current.tickProgress} />
      </Box>

      {showUTC && (
        <Typography
          variant="caption"
          sx={{
            mt: 1.5,
            display: 'block',
            color: 'rgba(158, 158, 158, 0.8)',
            letterSpacing: '0.15em',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: '0.7rem',
          }}
        >
          {formatTime(localSec)}
        </Typography>
      )}

      <Box aria-live="polite" sx={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        Hex time {current.hex}, {formatTime(localSec)}
      </Box>
    </Box>
  );
}
