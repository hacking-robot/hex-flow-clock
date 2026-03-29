import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import { hexTimeToArcs } from '../lib/arcUtils';
import { formatTime } from '../lib/timeFormatter';
import type { HexTime } from '../lib/timeFormatter';

interface CircularClockDisplayProps {
  current: HexTime;
  currentDate: Date;
}

export function CircularClockDisplay({ current, currentDate }: CircularClockDisplayProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm')); // 600px+

  const size = isDesktop ? 400 : 310;
  const cx = size / 2;
  const cy = size / 2;
  const blockStroke = isDesktop ? 16 : 12;
  const subStroke = isDesktop ? 12 : 8;
  const tickStroke = isDesktop ? 8 : 6;
  const gap = isDesktop ? 18 : 14;
  const legendOffset = isDesktop ? 22 : 18;

  const radii = {
    block: cx - blockStroke / 2 - 4 - legendOffset,
    sub: cx - blockStroke - gap - subStroke / 2 - legendOffset,
    tick: cx - blockStroke - gap - subStroke - gap - tickStroke / 2 - legendOffset,
  };

  const legendRadius = radii.block + blockStroke / 2 + (isDesktop ? 14 : 11);
  const HEX_LABELS = '0123456789ABCDEF';

  const arcs = hexTimeToArcs(current, cx, cy, radii);

  const localSec =
    currentDate.getHours() * 3600 +
    currentDate.getMinutes() * 60 +
    currentDate.getSeconds();
  const localTimeStr = formatTime(localSec);

  return (
    <Box sx={{ textAlign: 'center', position: 'relative' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Hex time ${current.hex}, local time ${localTimeStr}`}
        style={{ display: 'block', margin: '0 auto' }}
      >
        <defs>
          {/* Block (outer): purple → cyan */}
          <linearGradient id="arc-gradient-block" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C4DFF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
          {/* Sub (middle): lighter purple → cyan */}
          <linearGradient id="arc-gradient-sub" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9C6FFF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
          {/* Tick (inner): soft purple → cyan */}
          <linearGradient id="arc-gradient-tick" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B47CFF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
        </defs>

        {/* Track rings (background) */}
        <circle cx={cx} cy={cy} r={radii.block} fill="none" stroke="rgba(124, 77, 255, 0.1)" strokeWidth={blockStroke} />
        <circle cx={cx} cy={cy} r={radii.sub} fill="none" stroke="rgba(124, 77, 255, 0.08)" strokeWidth={subStroke} />
        <circle cx={cx} cy={cy} r={radii.tick} fill="none" stroke="rgba(124, 77, 255, 0.06)" strokeWidth={tickStroke} />

        {/* Block arc (outer) */}
        {arcs.block.d && (
          <path
            d={arcs.block.d}
            fill="none"
            stroke="url(#arc-gradient-block)"
            strokeWidth={blockStroke}
            strokeLinecap="round"
          />
        )}

        {/* Sub arc (middle) */}
        {arcs.sub.d && (
          <path
            d={arcs.sub.d}
            fill="none"
            stroke="url(#arc-gradient-sub)"
            strokeWidth={subStroke}
            strokeLinecap="round"
            opacity={0.85}
          />
        )}

        {/* Tick arc (inner) */}
        {arcs.tick.d && (
          <path
            d={arcs.tick.d}
            fill="none"
            stroke="url(#arc-gradient-tick)"
            strokeWidth={tickStroke}
            strokeLinecap="round"
            opacity={0.7}
          />
        )}

        {/* Hex legends (0–F) around the outer ring like clock numbers */}
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const x = cx + legendRadius * Math.cos(rad);
          const y = cy + legendRadius * Math.sin(rad);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(158, 158, 158, 0.4)"
              fontFamily='"JetBrains Mono", "Fira Code", monospace'
              fontSize={isDesktop ? 11 : 9}
              fontWeight={400}
            >
              {HEX_LABELS[i]}
            </text>
          );
        })}
      </svg>

      {/* Visually hidden aria-live region for screen reader announcements */}
      <Box
        aria-live="polite"
        sx={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}
      >
        Hex time {current.hex}, {localTimeStr}
      </Box>
    </Box>
  );
}
