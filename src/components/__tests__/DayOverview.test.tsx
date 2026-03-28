import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DayOverview } from '../DayOverview';
import type { BlockRepresentation, TimeFormat } from '../../lib/timeFormatter';

describe('DayOverview', () => {
  const currentBlock: BlockRepresentation = {
    hour: 14,
    blockNumber: 3,
    blockLabel: '2:30 PM',
    blockStartMinute: 30,
  };

  const format: TimeFormat = '12h';

  it('renders 96 grid cells', () => {
    render(<DayOverview currentBlock={currentBlock} format={format} />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(96);
  });

  it('renders cells with accessible labels', () => {
    render(<DayOverview currentBlock={currentBlock} format={format} />);
    // Block 1 = hour 0 block 1 → past
    expect(screen.getByLabelText('Block 1 of 96, past')).toBeInTheDocument();
    // Block 59 = hour 14 block 3 → current
    expect(screen.getByLabelText('Block 59 of 96, current')).toBeInTheDocument();
    // Block 96 = hour 23 block 4 → future
    expect(screen.getByLabelText('Block 96 of 96, future')).toBeInTheDocument();
  });

  it('styles the current block cell differently from past and future', () => {
    render(<DayOverview currentBlock={currentBlock} format={format} />);
    const currentCell = screen.getByLabelText('Block 59 of 96, current');
    const pastCell = screen.getByLabelText('Block 1 of 96, past');
    const futureCell = screen.getByLabelText('Block 96 of 96, future');

    // Current, past, and future cells should have different computed styles
    const currentStyle = window.getComputedStyle(currentCell);
    const pastStyle = window.getComputedStyle(pastCell);
    const futureStyle = window.getComputedStyle(futureCell);

    // At minimum, the class names should differ since MUI applies different sx styles
    expect(currentCell.className).not.toBe(pastCell.className);
    expect(currentCell.className).not.toBe(futureCell.className);
  });
});
