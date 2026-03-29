import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { formatTime } from '../lib/timeFormatter';
import type { HexTime } from '../lib/timeFormatter';

interface Props {
  current: HexTime;
  currentDate: Date;
  showUTC?: boolean;
}

export function ClockDisplay({ current, currentDate, showUTC }: Props) {
  const localSec = currentDate.getHours() * 3600 + currentDate.getMinutes() * 60 + currentDate.getSeconds();

  const rectW = 320;
  const rectH = 180;
  const rectR = 16;
  const rectPerimeter = 2 * (rectW - 2 * rectR) + 2 * (rectH - 2 * rectR) + 2 * Math.PI * rectR;
  const progressFraction = current.tickProgress / 100;
  const dashOffset = rectPerimeter * (1 - progressFraction);
  const fadeOut = progressFraction > 0.85 ? 1 - (progressFraction - 0.85) / 0.15 : 1;
  const fadeIn = progressFraction < 0.05 ? progressFraction / 0.05 : 1;
  const rectOpacity = 0.5 * fadeOut * fadeIn;
  const padding = 12;

  const rx = padding / 2;
  const ry = padding / 2;
  const midX = rx + rectW / 2;
  const digitalBorderPath = [
    `M ${midX} ${ry}`,
    `L ${rx + rectW - rectR} ${ry}`,
    `A ${rectR} ${rectR} 0 0 1 ${rx + rectW} ${ry + rectR}`,
    `L ${rx + rectW} ${ry + rectH - rectR}`,
    `A ${rectR} ${rectR} 0 0 1 ${rx + rectW - rectR} ${ry + rectH}`,
    `L ${rx + rectR} ${ry + rectH}`,
    `A ${rectR} ${rectR} 0 0 1 ${rx} ${ry + rectH - rectR}`,
    `L ${rx} ${ry + rectR}`,
    `A ${rectR} ${rectR} 0 0 1 ${rx + rectR} ${ry}`,
    `Z`,
  ].join(' ');

  return (
    <Box sx={{ textAlign: 'center', position: 'relative' }}>
      <svg
        width={rectW + padding}
        height={rectH + padding}
        viewBox={`0 0 ${rectW + padding} ${rectH + padding}`}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id="digital-rect-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C4DFF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
        </defs>
        <path d={digitalBorderPath} fill="none" stroke="rgba(124, 77, 255, 0.08)" strokeWidth={2} />
        <path
          d={digitalBorderPath}
          fill="none"
          stroke="url(#digital-rect-gradient)"
          strokeWidth={2}
          strokeDasharray={rectPerimeter}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          opacity={rectOpacity}
          style={{ transition: 'stroke-dashoffset 0.1s linear, opacity 0.3s ease' }}
        />
      </svg>

      <Box sx={{ position: 'relative', py: 2, px: 3 }}>
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
      </Box>

      <Box aria-live="polite" sx={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        Hex time {current.hex}, {formatTime(localSec)}
      </Box>
    </Box>
  );
}
