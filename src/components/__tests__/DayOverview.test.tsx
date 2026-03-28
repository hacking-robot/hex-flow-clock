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
  const awakeStart = 420; // 7:00
  const awakeEnd = 1380; // 23:00

  it('renders 16 grid cells', () => {
    render(<DayOverview currentBlock={currentBlock} config={config} awakeStart={awakeStart} awakeEnd={awakeEnd} />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(16);
  });

  it('marks sleep blocks in accessible labels', () => {
    render(<DayOverview currentBlock={currentBlock} config={config} awakeStart={awakeStart} awakeEnd={awakeEnd} />);
    // Block 1 starts at 0:00 — before 7:00, so it's sleep
    expect(screen.getByLabelText('Block 1 of 16, past, sleep')).toBeInTheDocument();
    // Block 10 starts at 13:30 — awake and current
    expect(screen.getByLabelText('Block 10 of 16, current')).toBeInTheDocument();
  });

  it('styles current block differently', () => {
    render(<DayOverview currentBlock={currentBlock} config={config} awakeStart={awakeStart} awakeEnd={awakeEnd} />);
    const current = screen.getByLabelText('Block 10 of 16, current');
    const sleep = screen.getByLabelText('Block 1 of 16, past, sleep');
    expect(current.className).not.toBe(sleep.className);
  });
});
