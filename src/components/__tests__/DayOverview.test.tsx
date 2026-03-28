import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DayOverview } from '../DayOverview';
import type { BlockRepresentation } from '../../lib/timeFormatter';

describe('DayOverview', () => {
  const currentBlock: BlockRepresentation = {
    globalBlock: 10,
    totalBlocks: 16,
    blockLabel: '13:30',
    blockStartMinute: 810,
  };

  const config = { blockMinutes: 90, startMinute: 0 };

  it('renders 16 grid cells', () => {
    render(<DayOverview currentBlock={currentBlock} config={config} />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(16);
  });

  it('renders cells with accessible labels', () => {
    render(<DayOverview currentBlock={currentBlock} config={config} />);
    expect(screen.getByLabelText('Block 1 of 16, past')).toBeInTheDocument();
    expect(screen.getByLabelText('Block 10 of 16, current')).toBeInTheDocument();
    expect(screen.getByLabelText('Block 16 of 16, future')).toBeInTheDocument();
  });

  it('styles current block differently', () => {
    render(<DayOverview currentBlock={currentBlock} config={config} />);
    const current = screen.getByLabelText('Block 10 of 16, current');
    const past = screen.getByLabelText('Block 1 of 16, past');
    expect(current.className).not.toBe(past.className);
  });
});
