import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { TimeFormat } from '../lib/timeFormatter';

interface FormatToggleProps {
  format: TimeFormat;
  onChange: (format: TimeFormat) => void;
}

export default function FormatToggle({ format, onChange }: FormatToggleProps) {
  const handleChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value === '12h' || value === '24h') {
      onChange(value);
    }
  };

  return (
    <ToggleButtonGroup
      value={format}
      exclusive
      onChange={handleChange}
      aria-label="Time format"
    >
      <ToggleButton value="12h">12h</ToggleButton>
      <ToggleButton value="24h">24h</ToggleButton>
    </ToggleButtonGroup>
  );
}
