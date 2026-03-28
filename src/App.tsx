import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useBlockTime } from './hooks/useBlockTime';
import { useBlockDuration } from './hooks/useBlockDuration';
import { useStartTime } from './hooks/useStartTime';
import { ClockDisplay } from './components/ClockDisplay';
import { DayOverview } from './components/DayOverview';
import { BlockDurationSetting } from './components/BlockDurationSetting';
import type { BlockConfig } from './lib/timeFormatter';

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0', contrastText: '#ffffff' },
    text: { primary: '#212121', secondary: '#424242' },
    grey: { 100: '#f5f5f5', 300: '#bdbdbd', 600: '#424242' },
    background: { default: '#fafafa' },
  },
});

export default function App() {
  const [blockMinutes, setBlockMinutes] = useBlockDuration();
  const [startMinute, setStartMinute] = useStartTime();
  const config: BlockConfig = useMemo(
    () => ({ blockMinutes, startMinute }),
    [blockMinutes, startMinute],
  );
  const { currentBlock, progress } = useBlockTime(config);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
          <ClockDisplay
            globalBlock={currentBlock.globalBlock}
            totalBlocks={currentBlock.totalBlocks}
            blockLabel={currentBlock.blockLabel}
            progress={progress}
          />
          <DayOverview currentBlock={currentBlock} config={config} />
          <BlockDurationSetting
            blockMinutes={blockMinutes}
            onBlockMinutesChange={setBlockMinutes}
            startMinute={startMinute}
            onStartMinuteChange={setStartMinute}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
