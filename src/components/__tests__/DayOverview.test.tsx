import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DayOverview } from '../DayOverview';
import type { BlockState } from '../../lib/timeFormatter';

describe('DayOverview', () => {
  const current: BlockState = {
    block: 10, subBlock: 3, totalBlocks: 16, subBlocksPerBlock: 6,
    blockStartMinute: 810, blockLabel: '13:30', minutesInSubBlock: 7,
  };
  const config = { blockMinutes: 90, subBlockMinutes: 15 };

  it('renders correct number of blocks', () => {
    render(<DayOverview current={current} config={config} />);
    expect(screen.getAllByRole('gridcell')).toHaveLength(16);
  });

  it('marks current block', () => {
    render(<DayOverview current={current} config={config} />);
    expect(screen.getByLabelText('Block 10 of 16, current')).toBeInTheDocument();
  });
});
