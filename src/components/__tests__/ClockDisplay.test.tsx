import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClockDisplay } from '../ClockDisplay';
import type { BlockState } from '../../lib/timeFormatter';

describe('ClockDisplay', () => {
  const current: BlockState = {
    block: 10, subBlock: 3, totalBlocks: 16, subBlocksPerBlock: 6,
    blockStartMinute: 810, blockLabel: '13:30', minutesInSubBlock: 7,
  };

  it('renders block.subBlock', () => {
    render(<ClockDisplay current={current} progress={47} currentDate={new Date(2024, 0, 1, 14, 7)} subBlockMinutes={15} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('.3')).toBeInTheDocument();
  });

  it('renders progress bar', () => {
    render(<ClockDisplay current={current} progress={47} currentDate={new Date(2024, 0, 1, 14, 7)} subBlockMinutes={15} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
