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

const statusStyles = {
  past: { bgcolor: 'grey.300', color: 'grey.600' },
  current: { bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700 },
  future: { bgcolor: 'grey.100', color: 'text.secondary' },
} as const;

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
      {blocks.map((block) => {
        const status = classifyBlock(block, currentBlock);
        const awake = isAwake(block, awakeStart, awakeEnd);
        return (
          <Box
            key={block.globalBlock}
            role="gridcell"
            aria-label={`Block ${block.globalBlock} of ${total}, ${status}${awake ? '' : ', sleep'}`}
            sx={{
              ...statusStyles[status],
              ...(!awake && status !== 'current' && { opacity: 0.35 }),
              borderRadius: 0.5,
              textAlign: 'center',
              fontSize: '0.6rem',
              py: 0.4,
              minHeight: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ fontWeight: status === 'current' ? 700 : 400 }}>{block.globalBlock}</Box>
            <Box sx={{ fontSize: '0.5rem', opacity: 0.7 }}>{block.blockLabel}</Box>
          </Box>
        );
      })}
    </Box>
  );
}
