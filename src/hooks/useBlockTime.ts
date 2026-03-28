import { useState, useEffect } from 'react';
import { dateToHex } from '../lib/timeFormatter';
import type { HexTime } from '../lib/timeFormatter';

interface HexTimeState {
  current: HexTime;
  currentDate: Date;
}

export function useHexTime(): HexTimeState {
  const [state, setState] = useState<HexTimeState>(() => {
    const now = new Date();
    return { current: dateToHex(now), currentDate: now };
  });

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setState({ current: dateToHex(now), currentDate: now });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return state;
}
