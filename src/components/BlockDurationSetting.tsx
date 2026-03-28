import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { totalBlocks } from '../lib/timeFormatter';

interface BlockDurationSettingProps {
  blockMinutes: number;
  onBlockMinutesChange: (minutes: number) => void;
  startMinute: number;
  onStartMinuteChange: (minute: number) => void;
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

const startMarks = [0, 6, 12, 18].map((h) => ({
  value: h * 60,
  label: `${h}:00`,
}));

export function BlockDurationSetting({
  blockMinutes, onBlockMinutesChange,
  startMinute, onStartMinuteChange,
}: BlockDurationSettingProps) {
  const total = totalBlocks(blockMinutes);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        {blockMinutes} min/block · {total} blocks · starts {formatTime(startMinute)}
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
        Day starts at
      </Typography>
      <Slider
        value={startMinute}
        onChange={(_, v) => onStartMinuteChange(v as number)}
        min={0} max={1380} step={30}
        marks={startMarks}
        size="small"
        valueLabelDisplay="auto"
        valueLabelFormat={formatTime}
        aria-label="Day start time"
      />
    </Box>
  );
}
