import { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { totalBlocks, subBlocksPerBlock } from '../lib/timeFormatter';

interface Props {
  blockMinutes: number;
  onBlockMinutesChange: (m: number) => void;
  subBlockMinutes: number;
  onSubBlockMinutesChange: (m: number) => void;
}

const blockMarks = [30, 60, 90, 120, 180, 240].map((v) => ({ value: v, label: `${v}` }));
const subMarks = [5, 10, 15, 30, 45, 60].map((v) => ({ value: v, label: `${v}` }));

export function BlockDurationSetting({
  blockMinutes, onBlockMinutesChange,
  subBlockMinutes, onSubBlockMinutesChange,
}: Props) {
  const total = totalBlocks(blockMinutes);
  const subs = subBlocksPerBlock({ blockMinutes, subBlockMinutes });
  const configCode = `${blockMinutes}/${subBlockMinutes}`;
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);

  const applyCode = (code: string) => {
    const parts = code.trim().split('/');
    if (parts.length !== 2) { setCodeError(true); return; }
    const [bm, sm] = parts.map(Number);
    if (isNaN(bm) || isNaN(sm)) { setCodeError(true); return; }
    if (bm < 15 || bm > 240 || sm < 5 || sm > 60 || sm > bm) { setCodeError(true); return; }
    setCodeError(false);
    onBlockMinutesChange(bm);
    onSubBlockMinutesChange(sm);
    setCodeInput('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Settings</Typography>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          Config:
        </Typography>
        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {configCode}
        </Typography>
        <TextField
          size="small"
          placeholder="e.g. 90/15"
          value={codeInput}
          onChange={(e) => { setCodeInput(e.target.value); setCodeError(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') applyCode(codeInput); }}
          error={codeError}
          sx={{ flex: 1, '& input': { fontSize: '0.75rem', fontFamily: 'monospace', py: 0.5 } }}
        />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        {blockMinutes}min blocks · {subs} sub-blocks of {subBlockMinutes}min · {total} blocks/day
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
        Block duration (min)
      </Typography>
      <Slider
        value={blockMinutes}
        onChange={(_, v) => onBlockMinutesChange(v as number)}
        min={15} max={240} step={15}
        marks={blockMarks}
        size="small"
        aria-label="Block duration"
        sx={{ mb: 2 }}
      />

      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
        Sub-block precision (min)
      </Typography>
      <Slider
        value={subBlockMinutes}
        onChange={(_, v) => {
          const val = v as number;
          if (val <= blockMinutes) onSubBlockMinutesChange(val);
        }}
        min={5} max={60} step={5}
        marks={subMarks}
        size="small"
        aria-label="Sub-block duration"
      />
    </Box>
  );
}
