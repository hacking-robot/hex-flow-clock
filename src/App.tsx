import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useHexTime } from './hooks/useBlockTime';
import { ClockDisplay } from './components/ClockDisplay';
import { DayOverview } from './components/DayOverview';
import { TimeConverter } from './components/TimeConverter';

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0', contrastText: '#ffffff' },
    text: { primary: '#212121', secondary: '#424242' },
    grey: { 100: '#f5f5f5', 300: '#bdbdbd', 600: '#424242' },
    background: { default: '#fafafa' },
  },
});

export default function App() {
  const { current, currentDate } = useHexTime();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
          <ClockDisplay current={current} currentDate={currentDate} showUTC={showDetails} />
          <IconButton
            onClick={() => setShowDetails((v) => !v)}
            size="small"
            aria-label={showDetails ? 'Hide details' : 'Show details'}
            sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
          >
            {showDetails ? '▲ less' : '▼ more'}
          </IconButton>
          {showDetails && (
            <>
              <DayOverview current={current} />
              <TimeConverter />
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
