import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import { useHexTime } from './hooks/useBlockTime';
import { ClockDisplay } from './components/ClockDisplay';
import { CircularClockDisplay } from './components/CircularClockDisplay';
import { ViewToggle } from './components/ViewToggle';
import { DayOverview } from './components/DayOverview';
import { ConversionExplainer } from './components/ConversionExplainer';
import { TimeConverter } from './components/TimeConverter';

export type ClockViewMode = 'numerical' | 'circular';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7C4DFF' },
    secondary: { main: '#00E5FF' },
    background: { default: '#0a0a1a', paper: '#1a1a2e' },
    text: { primary: '#E0E0E0', secondary: '#9E9E9E' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
    h1: { fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontWeight: 700 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem' },
  },
  shape: { borderRadius: 12 },
});

export default function App() {
  const { current, currentDate } = useHexTime();
  const [showDetails, setShowDetails] = useState(false);
  const [activeView, setActiveView] = useState<ClockViewMode>('numerical');

  const handleToggleView = () => {
    setActiveView((prev) => (prev === 'numerical' ? 'circular' : 'numerical'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #0a0a1a 0%, #1a0a2e 25%, #0a1a2e 50%, #0a0a1a 75%, #1a0a20 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(124, 77, 255, 0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 }, px: { xs: 2, sm: 3 }, position: 'relative' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 3, sm: 5 } }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                background: 'linear-gradient(90deg, rgba(124, 77, 255, 0.3), rgba(0, 229, 255, 0.3))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                mt: { xs: 1, sm: 2 },
              }}
            >
              Hexflow Clock
            </Typography>
            <ViewToggle activeView={activeView} onToggle={handleToggleView} />
            <Box sx={{ mt: { xs: 0, sm: 2 } }}>
              {activeView === 'numerical' ? (
                <ClockDisplay current={current} currentDate={currentDate} showUTC={showDetails} />
              ) : (
                <CircularClockDisplay current={current} currentDate={currentDate} />
              )}
            </Box>
            <Box
              onClick={() => setShowDetails((v) => !v)}
              role="button"
              tabIndex={0}
              aria-label={showDetails ? 'Hide details' : 'Show details'}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowDetails((v) => !v); } }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                width: '80%',
                cursor: 'pointer',
                py: 1,
                '&:hover .chevron': { opacity: 1, color: '#7C4DFF' },
                '&:hover .line': { borderColor: 'rgba(124, 77, 255, 0.3)' },
              }}
            >
              <Box className="line" sx={{ flex: 1, borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.3s ease' }} />
              <Box
                className="chevron"
                sx={{
                  color: 'rgba(0, 229, 255, 0.5)',
                  fontSize: '0.6rem',
                  transition: 'all 0.3s ease',
                  transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                  opacity: 0.6,
                  lineHeight: 1,
                }}
              >
                ▼
              </Box>
              <Box className="line" sx={{ flex: 1, borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.3s ease' }} />
            </Box>
            <Collapse in={showDetails} sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 3, sm: 4 } }}>
                <DayOverview current={current} />
                <Box
                  sx={{
                    width: '100%',
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <ConversionExplainer current={current} currentDate={currentDate} />
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <TimeConverter />
                </Box>
              </Box>
            </Collapse>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
