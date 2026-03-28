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
      sx={{
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(124, 77, 255, 0.1)',
        '& .MuiLinearProgress-bar': {
          borderRadius: 3,
          backgroundImage: 'linear-gradient(90deg, #7C4DFF 0%, #B47CFF 40%, #00E5FF 100%)',
          boxShadow: '0 0 12px rgba(124, 77, 255, 0.5)',
          transition: 'transform 0.1s linear',
        },
      }}
    />
  );
}
