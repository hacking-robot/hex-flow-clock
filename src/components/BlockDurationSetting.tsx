import { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { totalBlocks } from '../lib/timeFormatter';

interface BlockDurationSettingProps {
  blockMinutes: number;
  onBlockMinutesChange: (minutes: number) => void;
  startMinute: number;
  onStartMinuteChange: (minute: number) => void;
  sleepHours: number;
  onSleepHoursChange: (hours: number) => void;
  awakeEnd: number;
}

function formatTime(minuteOfDay: number): string {
  const h = Math.floor(minuteOfDay / 60);
  const m = minuteOfDay % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
}

const durationMarks = [15, 60, 120, 240].map((v) => ({
  value: v,
  label: `${v}`,
}));

const hourMarks = [0, 6, 12, 18].map((h) => ({
  value: h * 60,
  label: `${h}:00`,
}));

const sleepMarks = [4, 6, 8, 10, 12].map((h) => ({
  value: h,
  label: `${h}h`,
}));

export function BlockDurationSetting({
  blockMinutes, onBlockMinutesChange,
  startMinute, onStartMinuteChange,
  sleepHours, onSleepHoursChange,
  awakeEnd,
}: BlockDurationSettingProps) {
  const total = totalBlocks(blockMinutes);
  // Config code: blockMinutes/wakeHour/sleepHours
  // Wake time: show as decimal hours (7.5) or whole hours (7)
  const wakeHours = startMinute / 60;
  const wakeStr = wakeHours % 1 === 0 ? `${wakeHours}` : `${wakeHours}`;
  const sleepStr = sleepHours % 1 === 0 ? `${sleepHours}` : `${sleepHours}`;
  const configCode = `${blockMinutes}/${wakeStr}/${sleepStr}`;
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);

  // Parse wake value: supports "7", "7.5", or "7:30"
  function parseWake(s: string): number | null {
    const colonMatch = s.match(/^(\d{1,2}):(\d{2})$/);
    if (colonMatch) {
      const mins = parseInt(colonMatch[1], 10) * 60 + parseInt(colonMatch[2], 10);
      return mins >= 0 && mins < 1440 ? mins : null;
    }
    const num = parseFloat(s);
    if (isNaN(num) || num < 0 || num >= 24) return null;
    return Math.round(num * 60);
  }

  const applyCode = (code: string) => {
    const parts = code.trim().split('/');
    if (parts.length !== 3) { setCodeError(true); return; }
    const bm = parseInt(parts[0], 10);
    const wake = parseWake(parts[1]);
    const sh = parseFloat(parts[2]);
    if (isNaN(bm) || wake === null || isNaN(sh)) { setCodeError(true); return; }
    if (bm < 15 || bm > 240 || sh < 4 || sh > 12) { setCodeError(true); return; }
    setCodeError(false);
    onBlockMinutesChange(bm);
    onStartMinuteChange(wake);
    onSleepHoursChange(sh);
    setCodeInput('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
        Settings
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          Config code:
        </Typography>
        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {configCode}
        </Typography>
        <TextField
          size="small"
          placeholder="Paste code"
          value={codeInput}
          onChange={(e) => { setCodeInput(e.target.value); setCodeError(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') applyCode(codeInput); }}
          error={codeError}
          sx={{ flex: 1, '& input': { fontSize: '0.75rem', fontFamily: 'monospace', py: 0.5 } }}
        />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        {blockMinutes} min/block · {total} blocks · awake {formatTime(startMinute)}–{formatTime(awakeEnd)} · sleep {sleepHours}h
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
        Block duration (min)
      </Typography>
      <Slider
        value={blockMinutes}
        onChange={(_, v) => onBlockMinutesChange(v as number)}
        min={15} max={240} step={15}
        marks={durationMarks}
        size="small"
        aria-label="Block duration in minutes"
        sx={{ mb: 2 }}
      />

      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
        Usual wake up
      </Typography>
      <Slider
        value={startMinute}
        onChange={(_, v) => onStartMinuteChange(v as number)}
        min={0} max={1380} step={30}
        marks={hourMarks}
        size="small"
        valueLabelDisplay="auto"
        valueLabelFormat={formatTime}
        aria-label="Usual wake up time"
        sx={{ mb: 2 }}
      />

      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
        Usual sleep duration
      </Typography>
      <Slider
        value={sleepHours}
        onChange={(_, v) => onSleepHoursChange(v as number)}
        min={4} max={12} step={0.5}
        marks={sleepMarks}
        size="small"
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => `${v}h`}
        aria-label="Usual sleep duration"
      />
    </Box>
  );
}
