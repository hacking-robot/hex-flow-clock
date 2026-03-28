import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
          <ClockDisplay current={current} currentDate={currentDate} />
          <DayOverview current={current} />
          <TimeConverter />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
