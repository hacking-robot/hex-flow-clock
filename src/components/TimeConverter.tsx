import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { hexToSeconds, formatUTC, dateToHex } from '../lib/timeFormatter';

export function TimeConverter() {
  const [hexInput, setHexInput] = useState('');
  const [timeInput, setTimeInput] = useState('');

  // Hex → UTC
  let hexResult = '';
  if (hexInput.length === 3) {
    const sec = hexToSeconds(hexInput);
    if (sec !== null) hexResult = `UTC ${formatUTC(sec)}`;
  }

  // UTC → Hex
  let timeResult = '';
  const match = timeInput.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (match) {
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const s = match[3] ? parseInt(match[3], 10) : 0;
    if (h < 24 && m < 60 && s < 60) {
      const d = new Date(Date.UTC(2024, 0, 1, h, m, s));
      timeResult = dateToHex(d).hex;
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Convert</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
        Enter hex time (e.g. 1A2) or UTC time (H:MM or H:MM:SS).
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField label="Hex" size="small" fullWidth value={hexInput}
            onChange={(e) => setHexInput(e.target.value)} placeholder="1A2"
            inputProps={{ style: { fontFamily: 'monospace' } }} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', minHeight: 18 }}>
            {hexResult}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField label="UTC (H:MM)" size="small" fullWidth value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)} placeholder="14:30" />
          <Typography variant="caption" color="text.secondary"
            sx={{ mt: 0.5, display: 'block', minHeight: 18, fontFamily: 'monospace' }}>
            {timeResult}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
