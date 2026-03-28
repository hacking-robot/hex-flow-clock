import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClockDisplay } from '../ClockDisplay';

describe('ClockDisplay', () => {
  const defaultProps = {
    blockLabel: '2:30 PM',
    blockNumber: 3,
    hour: 14,
    progress: 50,
  };

  it('renders the block number prominently', () => {
    render(<ClockDisplay {...defaultProps} />);
    // hour 14, blockNumber 3 → global block 59
    expect(screen.getByText('59')).toBeInTheDocument();
    expect(screen.getByText('/ 96')).toBeInTheDocument();
  });

  it('renders the time label as secondary reference', () => {
    render(<ClockDisplay {...defaultProps} />);
    expect(screen.getByText('2:30 PM')).toBeInTheDocument();
  });

  it('has an aria-live="polite" region', () => {
    render(<ClockDisplay {...defaultProps} />);
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveTextContent('Block 59 of 96, 2:30 PM');
  });

  it('renders ProgressIndicator with correct aria attributes', () => {
    render(<ClockDisplay {...defaultProps} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label', 'Block progress');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });
});
