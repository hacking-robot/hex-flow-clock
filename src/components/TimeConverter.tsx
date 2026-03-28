import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { hexToSeconds, formatTime, dateToHex } from '../lib/timeFormatter';

const inputSx = {
  '& .MuiInputLabel-root': { color: 'rgba(124, 77, 255, 0.7)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#7C4DFF' },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: '#E0E0E0',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(124, 77, 255, 0.3)' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7C4DFF' },
  },
};

export function TimeConverter() {
  const [hexInput, setHexInput] = useState('');
  const [utcInput, setUtcInput] = useState('');
  const [source, setSource] = useState<'hex' | 'utc' | null>(null);

  function handleHexChange(value: string) {
    setHexInput(value);
    setSource('hex');
    if (value.length === 3) {
      const sec = hexToSeconds(value);
      if (sec !== null) { setUtcInput(formatTime(sec)); return; }
    }
    if (value === '') setUtcInput('');
  }

  function handleUtcChange(value: string) {
    setUtcInput(value);
    setSource('utc');
    const match = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (match) {
      const h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const s = match[3] ? parseInt(match[3], 10) : 0;
      if (h < 24 && m < 60 && s < 60) {
        const d = new Date(2024, 0, 1, h, m, s);
        setHexInput(dateToHex(d).hex);
        return;
      }
    }
    if (value === '') setHexInput('');
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'rgba(255,255,255,0.9)' }}>
        Convert
      </Typography>
      <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>
        Type in either field to convert.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            label="Hex"
            size="small"
            fullWidth
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="1A2"
            inputProps={{ style: { fontFamily: '"JetBrains Mono", "Fira Code", monospace' } }}
            sx={inputSx}
          />
        </Box>
        <Typography sx={{ color: 'rgba(124, 77, 255, 0.4)', fontSize: '1.2rem', mt: -0.5 }}>⇄</Typography>
        <Box sx={{ flex: 1 }}>
          <TextField
            label="Local (H:MM:SS)"
            size="small"
            fullWidth
            value={utcInput}
            onChange={(e) => handleUtcChange(e.target.value)}
            placeholder="14:30:00"
            inputProps={{ style: { fontFamily: '"JetBrains Mono", "Fira Code", monospace' } }}
            sx={inputSx}
          />
        </Box>
      </Box>
    </Box>
  );
}
