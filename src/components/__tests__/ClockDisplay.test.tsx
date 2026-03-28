import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClockDisplay } from '../ClockDisplay';

describe('ClockDisplay', () => {
  const current = { block: 1, sub: 10, tick: 2, hex: '1A2', tickProgress: 50 };
  const date = new Date(Date.UTC(2024, 0, 1, 7, 30, 0));

  it('renders hex time', () => {
    render(<ClockDisplay current={current} currentDate={date} />);
    expect(screen.getByText('1A2')).toBeInTheDocument();
  });

  it('renders progress bar', () => {
    render(<ClockDisplay current={current} currentDate={date} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
