import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CircularClockDisplay } from '../CircularClockDisplay';
import { formatTime } from '../../lib/timeFormatter';
import type { HexTime } from '../../lib/timeFormatter';

const HEX = '0123456789ABCDEF';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7C4DFF' },
    secondary: { main: '#00E5FF' },
    background: { default: '#0a0a1a', paper: '#1a1a2e' },
  },
});

/** Generator for valid HexTime objects. */
const hexTimeArb = fc
  .record({
    block: fc.integer({ min: 0, max: 15 }),
    sub: fc.integer({ min: 0, max: 15 }),
    tick: fc.integer({ min: 0, max: 15 }),
    tickProgress: fc.double({ min: 0, max: 100, noNaN: true }),
  })
  .map(({ block, sub, tick, tickProgress }) => ({
    block,
    sub,
    tick,
    hex: `${HEX[block]}${HEX[sub]}${HEX[tick]}`,
    tickProgress,
  }));

function renderWithTheme(current: HexTime) {
  const date = new Date(2024, 0, 1, 12, 0, 0);
  return render(
    <ThemeProvider theme={theme}>
      <CircularClockDisplay current={current} currentDate={date} />
    </ThemeProvider>,
  );
}

/**
 * Property 3: SVG renders four concentric track rings
 * **Validates: Requirements 2.1**
 */
describe('Feature: clock-view-toggle, Property 3: SVG renders track rings', () => {
  it('renders three background circle tracks for any valid HexTime', () => {
    fc.assert(
      fc.property(hexTimeArb, (current) => {
        const { unmount, container } = renderWithTheme(current);
        const circles = container.querySelectorAll('svg circle');
        expect(circles.length).toBe(3);
        unmount();
      }),
      { numRuns: 100 },
    );
  });
});


/**
 * Property 4: Accessible label contains hex time and local time
 * **Validates: Requirements 5.1**
 */
describe('Feature: clock-view-toggle, Property 4: Accessible label contains hex time and local time', () => {
  /** Generator for Date objects with valid hour/minute/second values. */
  const dateArb = fc
    .record({
      hour: fc.integer({ min: 0, max: 23 }),
      minute: fc.integer({ min: 0, max: 59 }),
      second: fc.integer({ min: 0, max: 59 }),
    })
    .map(({ hour, minute, second }) => new Date(2024, 0, 1, hour, minute, second));

  it('SVG aria-label contains both hex time string and formatted local time for any valid HexTime + Date', () => {
    fc.assert(
      fc.property(hexTimeArb, dateArb, (current, date) => {
        const localSec =
          date.getHours() * 3600 +
          date.getMinutes() * 60 +
          date.getSeconds();
        const expectedLocalTime = formatTime(localSec);

        const { unmount } = render(
          <ThemeProvider theme={theme}>
            <CircularClockDisplay current={current} currentDate={date} />
          </ThemeProvider>,
        );

        const svg = screen.getByRole('img');
        const ariaLabel = svg.getAttribute('aria-label') ?? '';

        expect(ariaLabel).toContain(current.hex);
        expect(ariaLabel).toContain(expectedLocalTime);

        unmount();
      }),
      { numRuns: 100 },
    );
  });
});
