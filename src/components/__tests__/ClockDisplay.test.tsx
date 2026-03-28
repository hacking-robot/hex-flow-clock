import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClockDisplay } from '../ClockDisplay';

describe('ClockDisplay', () => {
  const defaultProps = {
    globalBlock: 10,
    totalBlocks: 16,
    blockLabel: '13:30',
    progress: 50,
    minutesElapsed: 42,
    blockMinutes: 90,
    currentDate: new Date(2024, 0, 1, 14, 12, 0),
  };

  it('renders the block number with minutes elapsed', () => {
    render(<ClockDisplay {...defaultProps} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText("/ 16")).toBeInTheDocument();
    expect(screen.getByText("+42'")).toBeInTheDocument();
  });

  it('renders block start, current time, and block end around progress bar', () => {
    const { container } = render(<ClockDisplay {...defaultProps} />);
    expect(container.textContent).toContain('13:30');
    expect(container.textContent).toContain('14:12');
    expect(container.textContent).toContain('15:00');
  });

  it('renders block-level progress bar', () => {
    render(<ClockDisplay {...defaultProps} />);
    const bar = screen.getByRole('progressbar');
    // 42/90 ≈ 46.67%
    const value = parseFloat(bar.getAttribute('aria-valuenow')!);
    expect(value).toBeCloseTo(46.67, 0);
  });
});
