import Box from '@mui/material/Box';
import { generateDayBlocks, type BlockState, type BlockConfig } from '../lib/timeFormatter';

interface DayOverviewProps {
  current: BlockState;
  config: BlockConfig;
}

function blockColor(i: number, total: number, status: string): { bg: string; fg: string } {
  const hue = (i / total) * 360;
  if (status === 'current') return { bg: `hsl(${hue}, 70%, 45%)`, fg: '#fff' };
  if (status === 'past') return { bg: `hsl(${hue}, 50%, 75%)`, fg: `hsl(${hue}, 40%, 30%)` };
  return { bg: `hsl(${hue}, 55%, 88%)`, fg: `hsl(${hue}, 40%, 40%)` };
}

export function DayOverview({ current, config }: DayOverviewProps) {
  const blocks = generateDayBlocks(config);
  const total = blocks.length;
  const cols = total <= 4 ? total : total <= 12 ? Math.ceil(total / 2) : Math.ceil(total / 3);

  return (
    <Box
      role="grid"
      aria-label={`Day overview showing all ${total} blocks`}
      sx={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 0.5 }}
    >
      {blocks.map((block, i) => {
        const status = block.block < current.block ? 'past'
          : block.block > current.block ? 'future' : 'current';
        const { bg, fg } = blockColor(i, total, status);
        return (
          <Box
            key={block.block}
            role="gridcell"
            aria-label={`Block ${block.block} of ${total}, ${status}`}
            sx={{
              bgcolor: bg, color: fg,
              borderRadius: 0.5,
              textAlign: 'center',
              fontSize: '0.7rem',
              py: 0.3,
              minHeight: 24,
              border: status === 'current' ? '2px solid #fff' : 'none',
            }}
          >
            <Box sx={{ fontWeight: status === 'current' ? 700 : 400 }}>
              {block.block}
            </Box>
            <Box sx={{ display: 'flex', gap: '1px', justifyContent: 'center', mt: 0.25 }}>
              {block.subBlocks.map((sub) => {
                const isCurrentSub = status === 'current' && sub.subBlock === current.subBlock;
                const isPastSub = status === 'current' && sub.subBlock < current.subBlock;
                return (
                  <Box
                    key={sub.subBlock}
                    sx={{
                      width: 6, height: 6,
                      borderRadius: '50%',
                      bgcolor: isCurrentSub ? '#fff'
                        : isPastSub ? 'rgba(255,255,255,0.5)'
                        : 'rgba(0,0,0,0.15)',
                    }}
                  />
                );
              })}
            </Box>
            <Box sx={{ fontSize: '0.5rem', opacity: 0.7, mt: 0.25 }}>{block.blockLabel}</Box>
          </Box>
        );
      })}
    </Box>
  );
}
