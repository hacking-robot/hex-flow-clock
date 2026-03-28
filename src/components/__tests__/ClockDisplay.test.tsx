import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClockDisplay } from '../ClockDisplay';

describe('ClockDisplay', () => {
  const defaultProps = {
    globalBlock: 10,
    totalBlocks: 16,
    blockLabel: '13:30',
    progress: 50,
  };

  it('renders the block number', () => {
    render(<ClockDisplay {...defaultProps} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('/ 16')).toBeInTheDocument();
  });

  it('renders the time label', () => {
    render(<ClockDisplay {...defaultProps} />);
    expect(screen.getByText('13:30')).toBeInTheDocument();
  });

  it('has an aria-live region', () => {
    render(<ClockDisplay {...defaultProps} />);
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveTextContent('Block 10 of 16, 13:30');
  });

  it('renders ProgressIndicator with correct aria attributes', () => {
    render(<ClockDisplay {...defaultProps} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
  });
});
