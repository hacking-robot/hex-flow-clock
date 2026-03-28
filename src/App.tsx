import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useBlockTime } from './hooks/useBlockTime';
import { useBlockDuration } from './hooks/useBlockDuration';
import { useStartTime } from './hooks/useStartTime';
import { useSleepDuration } from './hooks/useSleepDuration';
import { ClockDisplay } from './components/ClockDisplay';
import { DayOverview } from './components/DayOverview';
import { BlockDurationSetting } from './components/BlockDurationSetting';
import { TimeConverter } from './components/TimeConverter';
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
  const [sleepHours, setSleepHours] = useSleepDuration();
  const awakeEnd = (startMinute + (24 - sleepHours) * 60) % 1440;
  const config: BlockConfig = useMemo(
    () => ({ blockMinutes, startMinute }),
    [blockMinutes, startMinute],
  );
  const { currentBlock, progress, minutesElapsed, currentDate } = useBlockTime(config);

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
            minutesElapsed={minutesElapsed}
            blockMinutes={blockMinutes}
            currentDate={currentDate}
          />
          <DayOverview currentBlock={currentBlock} config={config} awakeStart={startMinute} awakeEnd={awakeEnd} />
          <BlockDurationSetting
            blockMinutes={blockMinutes}
            onBlockMinutesChange={setBlockMinutes}
            startMinute={startMinute}
            onStartMinuteChange={setStartMinute}
            sleepHours={sleepHours}
            onSleepHoursChange={setSleepHours}
            awakeEnd={awakeEnd}
          />
          <TimeConverter config={config} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
