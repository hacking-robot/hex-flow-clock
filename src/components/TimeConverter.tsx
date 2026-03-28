import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { totalBlocks, type BlockConfig } from '../lib/timeFormatter';

interface TimeConverterProps {
  config: BlockConfig;
}

function formatMin(m: number): string {
  const wrapped = ((m % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const mm = (wrapped % 60).toString().padStart(2, '0');
  return `${h}:${mm}`;
}

export function TimeConverter({ config }: TimeConverterProps) {
  const [blockInput, setBlockInput] = useState('');
  const [timeInput, setTimeInput] = useState('');

  const total = totalBlocks(config.blockMinutes);

  // Block → Time
  let blockResult = '';
  const blockNum = parseInt(blockInput, 10);
  if (blockInput && blockNum >= 1 && blockNum <= total) {
    const start = (config.startMinute + (blockNum - 1) * config.blockMinutes) % 1440;
    const end = (start + config.blockMinutes) % 1440;
    blockResult = `${formatMin(start)} – ${formatMin(end)}`;
  }

  // Time → Block
  let timeResult = '';
  const match = timeInput.match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    const mins = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    if (mins >= 0 && mins < 1440) {
      const offset = ((mins - config.startMinute) % 1440 + 1440) % 1440;
      const block = Math.min(Math.floor(offset / config.blockMinutes) + 1, total);
      timeResult = `Block ${block}`;
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
        Convert
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
        Look up a block's time range or find which block a time falls in.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ flex: 1 }}>
        <TextField
          label="Block #"
          size="small"
          fullWidth
          value={blockInput}
          onChange={(e) => setBlockInput(e.target.value)}
          placeholder={`1–${total}`}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', minHeight: 18 }}>
          {blockResult}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        <TextField
          label="Time (H:MM)"
          size="small"
          fullWidth
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          placeholder="14:30"
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', minHeight: 18 }}>
          {timeResult}
        </Typography>
      </Box>
      </Box>
    </Box>
  );
}
