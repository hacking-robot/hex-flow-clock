import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import { describeArc } from '../lib/arcUtils';
import { formatTime } from '../lib/timeFormatter';
import type { HexTime } from '../lib/timeFormatter';

interface CircularClockDisplayProps {
  current: HexTime;
  currentDate: Date;
}

const HEX_LABELS = '0123456789ABCDEF';

interface RingConfig {
  cx: number;
  label: string;
  value: number;
  fractional: number; // 0–1 for smooth sweep
  gradientId: string;
}

export function CircularClockDisplay({ current, currentDate }: CircularClockDisplayProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const ringRadius = isDesktop ? 40 : 30;
  const strokeWidth = isDesktop ? 5 : 4;
  const legendOffset = isDesktop ? 10 : 8;
  const ringSpacing = isDesktop ? 130 : 100;
  const margin = isDesktop ? 24 : 18; // space between legends and rect border
  const contentHeight = (ringRadius + strokeWidth / 2 + legendOffset + 12) * 2;
  const contentWidth = ringSpacing * 2 + contentHeight;
  const svgWidth = contentWidth + margin * 2;
  const svgHeight = contentHeight + margin * 2;
  const cy = svgHeight / 2;

  const rings: RingConfig[] = [
    {
      cx: svgWidth / 2 - ringSpacing,
      label: 'Block',
      value: current.block,
      fractional: current.block / 16,
      gradientId: 'arc-gradient-block',
    },
    {
      cx: svgWidth / 2,
      label: 'Sub',
      value: current.sub,
      fractional: current.sub / 16,
      gradientId: 'arc-gradient-sub',
    },
    {
      cx: svgWidth / 2 + ringSpacing,
      label: 'Tick',
      value: current.tick,
      fractional: (current.tick + current.tickProgress / 100) / 16,
      gradientId: 'arc-gradient-tick',
    },
  ];

  const localSec =
    currentDate.getHours() * 3600 +
    currentDate.getMinutes() * 60 +
    currentDate.getSeconds();
  const localTimeStr = formatTime(localSec);

  const legendRadius = ringRadius + strokeWidth / 2 + legendOffset;

  const rectPad = 4;
  const rectX = rectPad;
  const rectY = rectPad;
  const rectW = svgWidth - rectPad * 2;
  const rectH = svgHeight - rectPad * 2;
  const rectR = isDesktop ? 16 : 12;
  const rectPerimeter = 2 * (rectW - 2 * rectR) + 2 * (rectH - 2 * rectR) + 2 * Math.PI * rectR;
  const progressFraction = current.tickProgress / 100;
  const dashOffset = rectPerimeter * (1 - progressFraction);
  const fadeOut = progressFraction > 0.85 ? 1 - (progressFraction - 0.85) / 0.15 : 1;
  const fadeIn = progressFraction < 0.05 ? progressFraction / 0.05 : 1;
  const rectOpacity = 0.5 * fadeOut * fadeIn;

  // Rounded rect path starting from top center, going clockwise
  const midX = rectX + rectW / 2;
  const borderPath = [
    `M ${midX} ${rectY}`,
    `L ${rectX + rectW - rectR} ${rectY}`,
    `A ${rectR} ${rectR} 0 0 1 ${rectX + rectW} ${rectY + rectR}`,
    `L ${rectX + rectW} ${rectY + rectH - rectR}`,
    `A ${rectR} ${rectR} 0 0 1 ${rectX + rectW - rectR} ${rectY + rectH}`,
    `L ${rectX + rectR} ${rectY + rectH}`,
    `A ${rectR} ${rectR} 0 0 1 ${rectX} ${rectY + rectH - rectR}`,
    `L ${rectX} ${rectY + rectR}`,
    `A ${rectR} ${rectR} 0 0 1 ${rectX + rectR} ${rectY}`,
    `Z`,
  ].join(' ');

  return (
    <Box sx={{ textAlign: 'center', position: 'relative' }}>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        role="img"
        aria-label={`Hex time ${current.hex}, local time ${localTimeStr}`}
        style={{ display: 'block', margin: '0 auto' }}
      >
        <defs>
          <linearGradient id="arc-gradient-block" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C4DFF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
          <linearGradient id="arc-gradient-sub" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9C6FFF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
          <linearGradient id="arc-gradient-tick" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B47CFF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
          <linearGradient id="rect-progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C4DFF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
        </defs>

        {/* Background border */}
        <path d={borderPath} fill="none" stroke="rgba(124, 77, 255, 0.08)" strokeWidth={2} />

        {/* Progress border — fills from top center, fades out on completion */}
        <path
          d={borderPath}
          fill="none"
          stroke="url(#rect-progress-gradient)"
          strokeWidth={2}
          strokeDasharray={rectPerimeter}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          opacity={rectOpacity}
          style={{ transition: 'stroke-dashoffset 0.1s linear, opacity 0.3s ease' }}
        />

        {rings.map((ring) => {
          const startAngle = -90;
          const sweep = ring.fractional * 360;
          const arcD = describeArc(ring.cx, cy, ringRadius, startAngle, startAngle + sweep);

          return (
            <g key={ring.label}>
              {/* Track */}
              <circle cx={ring.cx} cy={cy} r={ringRadius} fill="none" stroke="rgba(124, 77, 255, 0.08)" strokeWidth={strokeWidth} />

              {/* Arc */}
              {arcD && (
                <path
                  d={arcD}
                  fill="none"
                  stroke={`url(#${ring.gradientId})`}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              )}

              {/* 0–F legends */}
              {Array.from({ length: 16 }, (_, i) => {
                if (i % 2 !== 0) return null;
                const angle = (i / 16) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const x = ring.cx + legendRadius * Math.cos(rad);
                const y = cy + legendRadius * Math.sin(rad);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="rgba(158, 158, 158, 0.35)"
                    fontFamily='"JetBrains Mono", "Fira Code", monospace'
                    fontSize={isDesktop ? 8 : 6}
                    fontWeight={400}
                  >
                    {HEX_LABELS[i]}
                  </text>
                );
              })}

              {/* Label below - removed */}
            </g>
          );
        })}
      </svg>

      {/* Visually hidden aria-live region */}
      <Box
        aria-live="polite"
        sx={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}
      >
        Hex time {current.hex}, {localTimeStr}
      </Box>
    </Box>
  );
}
