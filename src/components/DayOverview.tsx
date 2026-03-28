import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { generateDayBlocks, type BlockRepresentation, type TimeFormat } from '../lib/timeFormatter';

/**
 * Classify a block as 'past', 'current', or 'future' relative to the current block.
 */
export function classifyBlock(
  block: BlockRepresentation,
  currentBlock: BlockRepresentation
): 'past' | 'current' | 'future' {
  if (block.hour < currentBlock.hour) return 'past';
  if (block.hour > currentBlock.hour) return 'future';
  if (block.blockNumber < currentBlock.blockNumber) return 'past';
  if (block.blockNumber > currentBlock.blockNumber) return 'future';
  return 'current';
}

function formatHourLabel(hour: number, format: TimeFormat): string {
  if (format === '24h') return `${hour}`;
  if (hour === 0) return '12a';
  if (hour < 12) return `${hour}a`;
  if (hour === 12) return '12p';
  return `${hour - 12}p`;
}

interface DayOverviewProps {
  currentBlock: BlockRepresentation;
  format: TimeFormat;
}

const statusStyles = {
  past: { bgcolor: 'grey.300', color: 'grey.600' },
  current: { bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700 },
  future: { bgcolor: 'grey.100', color: 'text.secondary' },
} as const;

export function DayOverview({ currentBlock, format }: DayOverviewProps) {
  const blocks = generateDayBlocks(format);

  // Group into 24 rows of 4
  const rows: BlockRepresentation[][] = [];
  for (let i = 0; i < blocks.length; i += 4) {
    rows.push(blocks.slice(i, i + 4));
  }

  return (
    <Box role="grid" aria-label="Day overview showing all 96 blocks">
      {rows.map((row, hourIndex) => (
        <Box
          key={hourIndex}
          sx={{
            display: 'grid',
            gridTemplateColumns: '28px repeat(4, 1fr)',
            gap: 0.5,
            mb: 0.25,
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{ fontSize: '0.6rem', color: 'text.secondary', textAlign: 'right', pr: 0.5 }}
          >
            {formatHourLabel(hourIndex, format)}
          </Typography>
          {row.map((block, blockIdx) => {
            const globalNum = hourIndex * 4 + blockIdx + 1;
            const status = classifyBlock(block, currentBlock);
            return (
              <Box
                key={globalNum}
                role="gridcell"
                aria-label={`Block ${globalNum} of 96, ${status}`}
                sx={{
                  ...statusStyles[status],
                  borderRadius: 0.5,
                  textAlign: 'center',
                  fontSize: '0.55rem',
                  py: 0.25,
                  minHeight: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {globalNum}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
