import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

interface ViewToggleProps {
  activeView: 'numerical' | 'circular';
  onToggle: () => void;
}

export function ViewToggle({ activeView, onToggle }: ViewToggleProps) {
  const ariaLabel =
    activeView === 'numerical'
      ? 'Switch to circular view'
      : 'Switch to numerical view';

  return (
    <Box
      role="group"
      aria-label="Clock view toggle"
      sx={{
        display: 'inline-flex',
        borderRadius: '12px',
        border: '1px solid rgba(124, 77, 255, 0.2)',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
      }}
    >
      <ToggleButton
        label="123"
        title="Numerical"
        isActive={activeView === 'numerical'}
        onClick={onToggle}
        ariaLabel={ariaLabel}
        disabled={activeView === 'numerical'}
      />
      <ToggleButton
        label="◔"
        title="Circular"
        isActive={activeView === 'circular'}
        onClick={onToggle}
        ariaLabel={ariaLabel}
        disabled={activeView === 'circular'}
      />
    </Box>
  );
}

interface ToggleButtonProps {
  label: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
  ariaLabel: string;
  disabled: boolean;
}

function ToggleButton({ label, title, isActive, onClick, ariaLabel, disabled }: ToggleButtonProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        onClick();
      }
    }
  };

  return (
    <ButtonBase
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      title={title}
      tabIndex={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: 2,
        py: 1,
        position: 'relative',
        transition: 'all 0.25s ease',
        cursor: disabled ? 'default' : 'pointer',
        ...(isActive
          ? {
              background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.25), rgba(0, 229, 255, 0.15))',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '20%',
                right: '20%',
                height: '2px',
                background: 'linear-gradient(90deg, #7C4DFF, #00E5FF)',
                borderRadius: '1px',
              },
            }
          : {
              background: 'transparent',
              '&:hover': {
                background: 'rgba(124, 77, 255, 0.08)',
              },
            }),
      }}
    >
      <Typography
        component="span"
        sx={{
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: '0.85rem',
          fontWeight: isActive ? 600 : 400,
          letterSpacing: '0.05em',
          transition: 'all 0.25s ease',
          ...(isActive
            ? {
                background: 'linear-gradient(135deg, #E0E0FF 0%, #7C4DFF 40%, #00E5FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }
            : {
                color: 'rgba(158, 158, 158, 0.7)',
              }),
        }}
      >
        {label}
      </Typography>
    </ButtonBase>
  );
}
