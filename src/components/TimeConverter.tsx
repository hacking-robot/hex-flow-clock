import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { totalBlocks, subBlocksPerBlock, type BlockConfig } from '../lib/timeFormatter';

interface Props { config: BlockConfig; }

function fmt(m: number): string {
  const h = Math.floor((m % 1440) / 60);
  const mm = (m % 1440) % 60;
  return `${h}:${mm.toString().padStart(2, '0')}`;
}

export function TimeConverter({ config }: Props) {
  const [blockInput, setBlockInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const total = totalBlocks(config.blockMinutes);
  const subs = subBlocksPerBlock(config);

  let blockResult = '';
  const parts = blockInput.split('.');
  const b = parseInt(parts[0], 10);
  const s = parts.length > 1 ? parseInt(parts[1], 10) : 1;
  if (b >= 1 && b <= total && s >= 1 && s <= subs) {
    const start = (b - 1) * config.blockMinutes + (s - 1) * config.subBlockMinutes;
    const end = start + config.subBlockMinutes;
    blockResult = `${fmt(start)} – ${fmt(end)}`;
  }

  let timeResult = '';
  const match = timeInput.match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    const mins = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    if (mins >= 0 && mins < 1440) {
      const block = Math.floor(mins / config.blockMinutes) + 1;
      const inBlock = mins - (block - 1) * config.blockMinutes;
      const sub = Math.floor(inBlock / config.subBlockMinutes) + 1;
      timeResult = `Block ${block}.${sub}`;
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Convert</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
        Enter block.sub (e.g. 10.3) or time (H:MM).
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField label="Block.Sub" size="small" fullWidth value={blockInput}
            onChange={(e) => setBlockInput(e.target.value)} placeholder="10.3" />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', minHeight: 18 }}>
            {blockResult}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField label="Time (H:MM)" size="small" fullWidth value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)} placeholder="14:30" />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', minHeight: 18 }}>
            {timeResult}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
