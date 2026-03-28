import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DayOverview } from '../DayOverview';

describe('DayOverview', () => {
  const current = { block: 5, sub: 3, tick: 7, hex: '537', tickProgress: 40 };

  it('renders 16 blocks', () => {
    render(<DayOverview current={current} />);
    expect(screen.getAllByRole('gridcell')).toHaveLength(16);
  });

  it('marks current block', () => {
    render(<DayOverview current={current} />);
    expect(screen.getByLabelText('Block 5, current')).toBeInTheDocument();
  });
});
