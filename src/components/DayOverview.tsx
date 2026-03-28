import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { generateBlocks, type HexTime } from '../lib/timeFormatter';

const HEX = '0123456789ABCDEF';

export function blockColor(i: number, status: string): { bg: string; fg: string } {
  const hue = (i / 16) * 360;
  if (status === 'current') return { bg: `hsl(${hue}, 85%, 50%)`, fg: '#fff' };
  if (status === 'past') return { bg: `hsl(${hue}, 65%, 30%)`, fg: 'rgba(255,255,255,0.7)' };
  return { bg: `hsl(${hue}, 70%, 18%)`, fg: 'rgba(255,255,255,0.4)' };
}

interface Props { current: HexTime; }

export function DayOverview({ current }: Props) {
  const blocks = generateBlocks();

  return (
    <Fade in timeout={600}>
      <Box sx={{ width: '100%' }}>
        <Box
          role="grid"
          aria-label="Day overview showing all 16 blocks"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(16, 1fr)',
            gap: '3px',
            width: '100%',
            p: 1.5,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          {blocks.map((block, i) => {
            const status = i < current.block ? 'past' : i > current.block ? 'future' : 'current';
            const t = i / 15;
            const hue = 260 + t * 40;
            const isCurrent = status === 'current';
            const isPast = status === 'past';

            return (
              <Tooltip
                key={i}
                title={`${HEX[i]} · ${block.startTime}`}
                arrow
                placement="top"
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'rgba(20, 20, 40, 0.95)',
                      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                      fontSize: '0.65rem',
                      letterSpacing: '0.05em',
                      border: '1px solid rgba(124, 77, 255, 0.2)',
                      backdropFilter: 'blur(8px)',
                    },
                  },
                  arrow: { sx: { color: 'rgba(20, 20, 40, 0.95)' } },
                }}
              >
              <Box
                role="gridcell"
                aria-label={`Block ${HEX[i]}, ${status}`}
                sx={{
                  background: isCurrent
                    ? `linear-gradient(180deg, hsl(${hue}, 80%, 55%), hsl(${hue}, 90%, 40%))`
                    : isPast
                      ? `hsl(${hue}, 50%, 22%)`
                      : `hsl(${hue}, 30%, 12%)`,
                  color: isCurrent ? '#fff' : isPast ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
                  borderRadius: 1.5,
                  textAlign: 'center',
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: '0.6rem',
                  py: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: isCurrent ? 700 : 400,
                  boxShadow: isCurrent
                    ? `0 0 14px hsla(${hue}, 80%, 55%, 0.6), 0 2px 8px rgba(0,0,0,0.4)`
                    : '0 1px 3px rgba(0,0,0,0.2)',
                  border: isCurrent
                    ? `1px solid hsla(${hue}, 80%, 65%, 0.5)`
                    : '1px solid rgba(255,255,255,0.03)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    background: isCurrent
                      ? `linear-gradient(180deg, hsl(${hue}, 85%, 60%), hsl(${hue}, 90%, 45%))`
                      : isPast
                        ? `hsl(${hue}, 55%, 26%)`
                        : `hsl(${hue}, 35%, 16%)`,
                    color: isCurrent ? '#fff' : 'rgba(255,255,255,0.7)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>{HEX[i]}</Box>
              </Box>
              </Tooltip>
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, px: 1.5 }}>
          <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)' }}>
            {blocks[0].startTime}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)' }}>
            24:00
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}
