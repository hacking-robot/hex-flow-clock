import LinearProgress from '@mui/material/LinearProgress';

interface ProgressIndicatorProps {
  progress: number;
}

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <LinearProgress
      variant="determinate"
      value={progress}
      aria-label="Block progress"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
