import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { formatUTC, type HexTime } from '../lib/timeFormatter';

const HEX = '0123456789ABCDEF';

const mono = { fontFamily: '"JetBrains Mono", "Fira Code", monospace' };

interface Props {
  current: HexTime;
  currentDate: Date;
}

export function ConversionExplainer({ current, currentDate }: Props) {
  const utcSec = currentDate.getUTCHours() * 3600 + currentDate.getUTCMinutes() * 60 + currentDate.getUTCSeconds();
  const utcStr = formatUTC(utcSec);

  const steps = [
    { label: 'Block', value: HEX[current.block], desc: '90 min', color: '#7C4DFF' },
    { label: 'Sub', value: HEX[current.sub], desc: '~5.6 min', color: '#B47CFF' },
    { label: 'Tick', value: HEX[current.tick], desc: '~21 sec', color: '#00E5FF' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* UTC source */}
      <Box sx={{ textAlign: 'center', mb: 2.5 }}>
        <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 0.5 }}>
          UTC Time
        </Typography>
        <Typography sx={{ ...mono, fontSize: '1.4rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
          {utcStr}
        </Typography>
      </Box>

      {/* Arrow down */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Box sx={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.3,
        }}>
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{
              width: 2,
              height: 6,
              borderRadius: 1,
              background: `rgba(124, 77, 255, ${0.15 + i * 0.1})`,
            }} />
          ))}
          <Typography sx={{ fontSize: '0.5rem', color: 'rgba(124, 77, 255, 0.5)', lineHeight: 1 }}>▼</Typography>
        </Box>
      </Box>

      {/* Breakdown: 3 digits side by side */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1.5, sm: 3 }, mb: 2.5 }}>
        {steps.map((step, i) => (
          <Box key={i} sx={{ textAlign: 'center', flex: '0 0 auto' }}>
            {/* Hex digit */}
            <Box sx={{
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              borderRadius: 2,
              background: `${step.color}15`,
              border: `1px solid ${step.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1,
              boxShadow: `0 0 20px ${step.color}15`,
            }}>
              <Typography sx={{
                ...mono,
                fontSize: { xs: '1.5rem', sm: '1.8rem' },
                fontWeight: 700,
                color: step.color,
              }}>
                {step.value}
              </Typography>
            </Box>
            {/* Label */}
            <Typography sx={{
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              mb: 0.2,
            }}>
              {step.label}
            </Typography>
            {/* Duration */}
            <Typography sx={{
              ...mono,
              fontSize: '0.55rem',
              color: 'rgba(255,255,255,0.25)',
            }}>
              {step.desc}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Dots between digits */}
      <Box sx={{ textAlign: 'center', mb: 1.5 }}>
        <Box sx={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.3,
        }}>
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{
              width: 2,
              height: 6,
              borderRadius: 1,
              background: `rgba(0, 229, 255, ${0.15 + i * 0.1})`,
            }} />
          ))}
          <Typography sx={{ fontSize: '0.5rem', color: 'rgba(0, 229, 255, 0.5)', lineHeight: 1 }}>▼</Typography>
        </Box>
      </Box>

      {/* Result */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 0.5 }}>
          Hex Time
        </Typography>
        <Typography sx={{
          ...mono,
          fontSize: '1.4rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #7C4DFF, #00E5FF)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {current.hex}
        </Typography>
      </Box>
    </Box>
  );
}
