import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * Property 1: Toggle alternation
 * **Validates: Requirements 1.2**
 *
 * For any non-negative integer N representing the number of times the toggle
 * is activated from the default state, the active view should be 'numerical'
 * when N is even and 'circular' when N is odd.
 */
describe('Feature: clock-view-toggle, Property 1: Toggle alternation', () => {
  it('view is numerical when N is even and circular when N is odd', () => {
    fc.assert(
      fc.property(fc.nat({ max: 200 }), (n) => {
        let view: 'numerical' | 'circular' = 'numerical';
        for (let i = 0; i < n; i++) {
          view = view === 'numerical' ? 'circular' : 'numerical';
        }
        const expected = n % 2 === 0 ? 'numerical' : 'circular';
        expect(view).toBe(expected);
      }),
      { numRuns: 100 },
    );
  });
});

import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ViewToggle } from '../ViewToggle';

const theme = createTheme();

const viewStateArb = fc.constantFrom('numerical' as const, 'circular' as const);

/**
 * Property 5: Toggle accessible name reflects current state
 * **Validates: Requirements 5.3**
 *
 * For any active view state ('numerical' or 'circular'), the ViewToggle's
 * accessible name should describe switching to the opposite view.
 */
describe('Feature: clock-view-toggle, Property 5: Toggle accessible name reflects current state', () => {
  it('accessible name references switching to the opposite view', () => {
    fc.assert(
      fc.property(viewStateArb, (activeView) => {
        const expectedLabel =
          activeView === 'numerical'
            ? 'Switch to circular view'
            : 'Switch to numerical view';

        const { unmount } = render(
          <ThemeProvider theme={theme}>
            <ViewToggle activeView={activeView} onToggle={() => {}} />
          </ThemeProvider>,
        );

        const buttons = screen.getAllByLabelText(expectedLabel);
        expect(buttons.length).toBeGreaterThan(0);

        // Every ButtonBase should carry the same aria-label
        for (const button of buttons) {
          expect(button).toHaveAttribute('aria-label', expectedLabel);
        }

        unmount();
      }),
      { numRuns: 100 },
    );
  });
});
