import Box from '@mui/material/Box';
import { generateBlocks, type HexTime } from '../lib/timeFormatter';

const HEX = '0123456789ABCDEF';

function blockColor(i: number, status: string): { bg: string; fg: string } {
  const hue = (i / 16) * 360;
  if (status === 'current') return { bg: `hsl(${hue}, 70%, 45%)`, fg: '#fff' };
  if (status === 'past') return { bg: `hsl(${hue}, 50%, 75%)`, fg: `hsl(${hue}, 40%, 30%)` };
  return { bg: `hsl(${hue}, 55%, 88%)`, fg: `hsl(${hue}, 40%, 40%)` };
}

interface Props { current: HexTime; }

export function DayOverview({ current }: Props) {
  const blocks = generateBlocks();

  return (
    <Box
      role="grid"
      aria-label="Day overview showing all 16 blocks"
      sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 0.5 }}
    >
      {blocks.map((block, i) => {
        const status = i < current.block ? 'past' : i > current.block ? 'future' : 'current';
        const { bg, fg } = blockColor(i, status);
        return (
          <Box
            key={i}
            role="gridcell"
            aria-label={`Block ${HEX[i]}, ${status}`}
            sx={{
              bgcolor: bg, color: fg,
              borderRadius: 0.5,
              textAlign: 'center',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              py: 0.4,
              minHeight: 28,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: status === 'current' ? 700 : 400,
              border: status === 'current' ? '2px solid #fff' : 'none',
            }}
          >
            <Box>{HEX[i]}</Box>
            <Box sx={{ fontSize: '0.5rem', opacity: 0.7 }}>{block.startUTC}</Box>
          </Box>
        );
      })}
    </Box>
  );
}
