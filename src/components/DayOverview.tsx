import Box from '@mui/material/Box';
import { generateDayBlocks, type BlockRepresentation, type BlockConfig } from '../lib/timeFormatter';

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
}

const statusStyles = {
  past: { bgcolor: 'grey.300', color: 'grey.600' },
  current: { bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700 },
  future: { bgcolor: 'grey.100', color: 'text.secondary' },
} as const;

export function DayOverview({ currentBlock, config }: DayOverviewProps) {
  const blocks = generateDayBlocks(config);
  const total = blocks.length;
  const cols = total <= 8 ? 4 : total <= 20 ? 4 : 6;

  return (
    <Box
      role="grid"
      aria-label={`Day overview showing all ${total} blocks`}
      sx={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 0.5 }}
    >
      {blocks.map((block) => {
        const status = classifyBlock(block, currentBlock);
        return (
          <Box
            key={block.globalBlock}
            role="gridcell"
            aria-label={`Block ${block.globalBlock} of ${total}, ${status}`}
            sx={{
              ...statusStyles[status],
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
