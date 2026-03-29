import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { HexTime } from '../lib/timeFormatter';

const mockHexTime: HexTime = {
  block: 5,
  sub: 10,
  tick: 3,
  hex: '5A3',
  tickProgress: 42,
};
const mockDate = new Date(2024, 0, 15, 14, 30, 0);

vi.mock('../hooks/useBlockTime', () => ({
  useHexTime: () => ({
    current: mockHexTime,
    currentDate: mockDate,
  }),
}));

import App from '../App';

/** Click the non-active toggle button (the one with aria-pressed="false"). */
function clickInactiveToggle() {
  const buttons = screen.getAllByRole('button', { pressed: false });
  // Find the toggle button inside the view toggle group
  const toggleGroup = screen.getByRole('group', { name: 'Clock view toggle' });
  const inactiveToggle = within(toggleGroup).getAllByRole('button', { pressed: false })[0];
  fireEvent.click(inactiveToggle);
}

describe('App view integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Validates: Requirements 1.4, 6.1
   * App defaults to numerical view on initial load.
   */
  it('defaults to numerical view on initial load', () => {
    render(<App />);

    // Numerical ClockDisplay renders a progressbar (unique to numerical view)
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // CircularClockDisplay renders an SVG with role="img" — should NOT be present
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    // The hex time text should be visible somewhere in the document
    expect(screen.getAllByText('5A3').length).toBeGreaterThan(0);
  });

  /**
   * Validates: Requirements 1.2, 6.1, 6.2
   * Toggling switches the rendered component.
   */
  it('switches to circular view after clicking the inactive toggle button', () => {
    render(<App />);

    clickInactiveToggle();

    // CircularClockDisplay should now be visible (SVG with role="img")
    expect(screen.getByRole('img')).toBeInTheDocument();

    // The numerical progress bar should be gone
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  /**
   * Validates: Requirements 6.1, 6.2, 6.3
   * After toggling back, ClockDisplay reappears with current time data.
   */
  it('switches back to numerical view and shows current time data', () => {
    render(<App />);

    // Toggle to circular
    clickInactiveToggle();
    expect(screen.getByRole('img')).toBeInTheDocument();

    // Toggle back to numerical
    clickInactiveToggle();

    // Numerical view should be back with the progressbar
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    // Hex time text still present
    expect(screen.getAllByText('5A3').length).toBeGreaterThan(0);
  });

  /**
   * Validates: Requirements 6.1, 6.2
   * Time data is current (not stale) after switching views.
   */
  it('displays current hex time in both views without stale data', () => {
    render(<App />);

    // Numerical view shows the hex time
    expect(screen.getAllByText('5A3').length).toBeGreaterThan(0);

    // Switch to circular
    clickInactiveToggle();

    // Circular view should show the same hex time in its SVG aria-label
    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('aria-label', expect.stringContaining('5A3'));

    // The center text element should also show the hex time
    expect(screen.getAllByText('5A3').length).toBeGreaterThan(0);
  });
});
