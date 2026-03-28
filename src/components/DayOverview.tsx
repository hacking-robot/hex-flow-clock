import Box from '@mui/material/Box';
import { generateDayBlocks, isAwake, type BlockRepresentation, type BlockConfig } from '../lib/timeFormatter';

export function classifyBlock(
  block: BlockRepresentation,
  currentBlock: BlockRepresentation
): 'past' | 'current' | 'future' {
  if (block.globalBlock < currentBlock.globalBlock) return 'past';
  if (block.globalBlock > currentBlock.globalBlock) return 'future';
  return 'current';
}

interface DayOverviewProps {
  currentBlock: BlockRepresentation;
  config: BlockConfig;
  awakeStart: number;
  awakeEnd: number;
}

function blockColor(index: number, total: number, awake: boolean, status: string): { bg: string; fg: string } {
  const hue = (index / total) * 360;
  if (status === 'current') return { bg: `hsl(${hue}, 70%, 45%)`, fg: '#fff' };
  if (!awake) return { bg: `hsl(${hue}, 20%, 30%)`, fg: `hsl(${hue}, 30%, 75%)` };
  if (status === 'past') return { bg: `hsl(${hue}, 50%, 75%)`, fg: `hsl(${hue}, 40%, 30%)` };
  return { bg: `hsl(${hue}, 55%, 88%)`, fg: `hsl(${hue}, 40%, 40%)` };
}

export function DayOverview({ currentBlock, config, awakeStart, awakeEnd }: DayOverviewProps) {
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
        const status = classifyBlock(block, currentBlock);
        const awake = isAwake(block, awakeStart, awakeEnd);
        const { bg, fg } = blockColor(i, total, awake, status);
        return (
          <Box
            key={block.globalBlock}
            role="gridcell"
            aria-label={`Block ${block.globalBlock} of ${total}, ${status}${awake ? '' : ', sleep'}`}
            sx={{
              bgcolor: bg,
              color: fg,
              borderRadius: 0.5,
              textAlign: 'center',
              fontSize: '0.7rem',
              py: 0.4,
              minHeight: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: status === 'current' ? 700 : 400,
              border: status === 'current' ? '2px solid #fff' : 'none',
            }}
          >
            <Box>{block.globalBlock}</Box>
            <Box sx={{ fontSize: '0.6rem', opacity: 0.8 }}>{block.blockLabel}</Box>
          </Box>
        );
      })}
    </Box>
  );
}
